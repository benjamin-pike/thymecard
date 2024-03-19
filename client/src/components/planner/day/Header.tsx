import { FC } from 'react';
import { DateTime } from 'luxon';
import styles from './header.module.scss';

interface IHeaderProps {
    date: DateTime;
    displayButtons: boolean;
    handleOpenAddEventModal: () => void;
    handleOpenCopyEventsModal: () => void;
    handleOpenClearEventsModal: () => void;
}

const Header: FC<IHeaderProps> = ({
    date,
    displayButtons,
    handleOpenAddEventModal,
    handleOpenCopyEventsModal,
    handleOpenClearEventsModal
}) => {
    return (
        <header className={styles.header}>
            <h1 className={styles.date}>
                <span className={styles.day}>{date.toFormat('cccc')}</span>
                <span>{date.toFormat('d')}</span>
                <span className={styles.month}>{date.toFormat('MMMM')}</span>
            </h1>

            {displayButtons && (
                <div className={styles.buttons}>
                    <button onClick={handleOpenAddEventModal}>
                        <strong>Create</strong> Event
                    </button>
                    <button onClick={handleOpenCopyEventsModal}>
                        <strong>Copy</strong> Events
                    </button>
                    <button onClick={handleOpenClearEventsModal}>
                        <strong>Clear</strong> Events
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
