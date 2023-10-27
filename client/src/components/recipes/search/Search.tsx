import { FC, useCallback } from 'react';
import styles from './search.module.scss';
import { ICONS } from '@/assets/icons';

interface ISearchProps {
    primaryPlaceholder: string;
    secondaryPlaceholder?: string;
    icon: JSX.Element;
    value: string;
    setValue: (search: string) => void;
    goFn?: () => void;
}

const GoIcon = ICONS.common.arrowRight;
const ClearIcon = ICONS.common.XSmall;

const Search: FC<ISearchProps> = ({ primaryPlaceholder, secondaryPlaceholder, icon, value, setValue, goFn }) => {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
        },
        [setValue]
    );

    const handleClear = useCallback(() => {
        setValue('');
    }, [setValue]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && goFn) {
                goFn();
            }
        },
        [goFn]
    );

    return (
        <div className={styles.search}>
            <div className={styles.icon}>{icon}</div>
            <input type="text" value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
            {!value && (
                <p>
                    {primaryPlaceholder} <span>{secondaryPlaceholder}</span>
                </p>
            )}
            {value && (
                <>
                    {goFn && (
                        <button className={styles.go} onClick={goFn}>
                            <GoIcon />
                        </button>
                    )}
                    <button className={styles.clear} onClick={handleClear}>
                        <ClearIcon />
                    </button>
                </>
            )}
        </div>
    );
};

export default Search;
