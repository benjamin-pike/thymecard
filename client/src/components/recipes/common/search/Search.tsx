import { FC, useCallback } from 'react';
import styles from './search.module.scss';
import { ICONS } from '@/assets/icons';

interface ISearchProps {
    primaryPlaceholder: string;
    secondaryPlaceholder?: string;
    icon: JSX.Element;
    value: string;
    setValue: (search: string) => void;
}

const CloseIcon = ICONS.common.XSmall

const Search: FC<ISearchProps> = ({ primaryPlaceholder, secondaryPlaceholder, icon, value, setValue }) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    const handleClear = useCallback(() => {
        setValue('');
    }, []);

    return (
        <div className={styles.search}>
            <div className={styles.icon}>{icon}</div>
            <input type="text" value={value} onChange={handleChange} />
            {!value && (
                <p>
                    {primaryPlaceholder} <span>{secondaryPlaceholder}</span>
                </p>
            )}
            {value && (
                <button onClick={handleClear}>
                    <CloseIcon />
                </button>
            )}
        </div>
    );
};

export default Search;
