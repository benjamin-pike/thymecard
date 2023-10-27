import { FC, useCallback } from 'react';
import { ICONS } from '@/assets/icons';
import styles from './search.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const SearchIcon = ICONS.common.search;
const ListIcon = ICONS.common.list;

interface ISearchProps {
    value: string;
    setValue: (value: string) => void;
    handleToggleVisibleInfo: () => void;
}

const Search: FC<ISearchProps> = ({ value, setValue, handleToggleVisibleInfo }) => {
    const viewport = useSelector((state: RootState) => state.viewport);
    const displaySwitchViewButton = viewport.customViewportSize === 'listPlus';

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        },
        [setValue]
    );

    return (
        <div className={styles.search}>
            <SearchIcon className={styles.searchIcon} />
            <input value={value} onChange={handleChange} />
            {displaySwitchViewButton && (
                <button className={styles.switchView} onClick={handleToggleVisibleInfo}>
                    <ListIcon />
                </button>
            )}
            {!value && (
                <p className={styles.placeholder}>
                    Search <span>for a nutritional information . . .</span>
                </p>
            )}
        </div>
    );
};

export default Search;
