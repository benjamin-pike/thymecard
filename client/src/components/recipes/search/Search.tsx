import { FC, useCallback } from "react";
import { GrFormSearch } from "react-icons/gr";
import { IoIosClose } from "react-icons/io";
import styles from './search.module.scss';

interface ISearchProps {
    search: string;
    setSearch: (search: string) => void;
}

const Search: FC<ISearchProps> = ({ search, setSearch }) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

    const handleClear = useCallback(() => {
        setSearch('');
    }, []);

    return (
        <div className={styles.search}>
            <GrFormSearch />
            <input type="text" value={search} onChange={handleChange} />
            {!search && (
                <p>
                    Search <span>by title or keyword . . .</span>
                </p>
            )}
            {search && (
                <button onClick={handleClear}>
                    <IoIosClose />
                </button>
            )}
        </div>
    );
};

export default Search;