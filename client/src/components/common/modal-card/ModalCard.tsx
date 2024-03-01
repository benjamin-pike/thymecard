import { FC, ReactElement } from 'react';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import ModalWrapper, { IModalWrapperProps } from '@/components/wrappers/modal/ModalWrapper';
import styles from './modal-card.module.scss';

interface IModalCardProps extends Omit<IModalWrapperProps, 'state'> {
    children: ReactElement;
    title: string;
    buttons: IModalCardButton[];
    state: 'open' | 'closing' | 'closed';
}

interface IModalCardButton {
    text: string;
    type: 'primary' | 'secondary';
    loadingText?: string;
    isLoading?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

const ModalCard: FC<IModalCardProps> = ({
    // Card
    children,
    title,
    buttons,
    state,
    // Wrapper
    blurBackground,
    closeOnClickOutside,
    handleCloseModal
}) => {
    return (
        <ModalWrapper
            state={state}
            blurBackground={blurBackground}
            closeOnClickOutside={closeOnClickOutside}
            handleCloseModal={handleCloseModal}
        >
            <section className={styles.card} data-state={state}>
                <header>
                    <h2>{title}</h2>
                </header>
                <div className={styles.divider} />
                {children}
                <div className={styles.divider} />
                <footer>
                    {buttons.map((button) => (
                        <button
                            key={button.text}
                            className={styles.create}
                            disabled={button.isLoading || button.disabled}
                            data-type={button.type}
                            onClick={button.onClick}
                        >
                            {button.isLoading ? (
                                <span>
                                    <LoadingSpinner size="small" />
                                    <p>{button.loadingText}</p>
                                </span>
                            ) : (
                                button.text
                            )}
                        </button>
                    ))}
                </footer>
            </section>
        </ModalWrapper>
    );
};

export default ModalCard;
