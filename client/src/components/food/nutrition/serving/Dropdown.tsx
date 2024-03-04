import { FC } from 'react';

import { useClickOutside } from '@/hooks/common/useClickOutside';
import { round } from '@/lib/number.utils';
import { IServing } from 'types/recipe.types';

import styles from './dropdown.module.scss';

interface IDropdownProps {
    isActive: boolean;
    candidates: IServing[];
    toggleButton: HTMLButtonElement | null;
    handleClickOutside: () => void;
    handleAltQuantityClick: (index: number) => () => void;
}

const Dropdown: FC<IDropdownProps> = ({ isActive, candidates, toggleButton, handleClickOutside, handleAltQuantityClick }) => {
    const ref = useClickOutside<HTMLDivElement>(handleClickOutside, [toggleButton]);

    return (
        <div ref={ref} className={styles.wrapper} data-active={isActive}>
            <div className={styles.dropdown}>
                <ul>
                    {candidates
                        ?.sort((a, b) => b.weight - a.weight)
                        .map(({ quantity, unit, weight }, i, arr) => (
                            <li key={quantity + unit}>
                                <button onClick={handleAltQuantityClick(i)}>
                                    <p>
                                        <span
                                            className={styles.quantity}
                                            style={{
                                                width: `${Math.max(...arr.map((_) => _.quantity.toString().length))}ch`
                                            }}
                                        >
                                            {quantity}
                                        </span>
                                        <span className={styles.unit}>{unit}</span>
                                        <span className={styles.weight}>{round(weight, 1)}g</span>
                                    </p>
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default Dropdown;
