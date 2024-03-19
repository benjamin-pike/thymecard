import { FC } from 'react';
import { DateTime } from 'luxon';
import styles from './header.module.scss';
import { ICONS } from '@/assets/icons';
import Tooltip from '@/components/common/tooltip/Tooltip';

const AddIcon = ICONS.common.plus;
const CopyIcon = ICONS.common.copy;
const ClearIcon = ICONS.common.XLarge;
const BookmarkIcon = ICONS.recipes.bookmark;

interface IHeaderProps {
    date: DateTime;
    displayButtons: boolean;
    handleOpenAddEventModal: () => void;
    handleOpenCopyEventsModal: () => void;
    handleOpenClearEventsModal: () => void;
    handleOpenBookmarkQuickSearch: () => void;
}

const Header: FC<IHeaderProps> = ({
    date,
    displayButtons,
    handleOpenAddEventModal,
    handleOpenCopyEventsModal,
    handleOpenBookmarkQuickSearch,
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
                    <button className={styles.create} onClick={handleOpenAddEventModal}>
                        <AddIcon /> Create
                    </button>
                    <button
                        className={styles.bookmark}
                        data-tooltip-id={'tooltip-add-boomarked'}
                        data-tooltip-content="Add Bookmarked Event"
                        onClick={handleOpenBookmarkQuickSearch}
                    >
                        <BookmarkIcon />
                    </button>
                    <button className={styles.copy} onClick={handleOpenCopyEventsModal}>
                        <CopyIcon />
                        Copy
                    </button>
                    <button className={styles.clear} onClick={handleOpenClearEventsModal}>
                        <ClearIcon />
                        Clear
                    </button>
                </div>
            )}
            <Tooltip id="tooltip-add-boomarked" place="bottom" size="small" offset={10} />
        </header>
    );
};

export default Header;
