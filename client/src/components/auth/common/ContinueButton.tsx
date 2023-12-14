import { FC } from 'react';
import styles from './continue-button.module.scss';

interface IContinueButtonProps {
    disabled?: boolean;
    handleContinue: () => void;
}

const ContinueButton: FC<IContinueButtonProps> = ({ disabled, handleContinue }) => {
    return (
        <button className={styles.button} disabled={disabled} onClick={handleContinue}>
            Continue
        </button>
    );
};

export default ContinueButton;
