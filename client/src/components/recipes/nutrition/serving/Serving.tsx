import { FC, useCallback, useRef, useState } from 'react';
import { useToggle } from '@mantine/hooks';

import Dropdown from './Dropdown';

import { ICONS } from '@/assets/icons';
import { queue } from '@/lib/common.utils';
import { IServing } from '@/types/recipe.types';

import styles from './serving.module.scss';

const PlusIcon = ICONS.common.plus;
const MinusIcon = ICONS.common.minus;
const RefreshIcon = ICONS.recipes.refresh;
const ToggleIcon = ICONS.common.toggle;

interface IServingProps {
    quantity: number;
    unit: string;
    weight: number;
    altServings: IServing[];
    incrementQuantity: () => void;
    decrementQuantity: () => void;
    handleQuantityInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleWeightInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleResetScale: () => void;
    handleAltQuantityClick: (closeDropdown: () => void) => (index: number) => () => void;
}

const Serving: FC<IServingProps> = ({
    quantity,
    unit,
    weight,
    altServings,
    incrementQuantity,
    decrementQuantity,
    handleQuantityInput,
    handleWeightInput,
    handleResetScale,
    handleAltQuantityClick
}) => {
    const [displayDropdown, toggleDropdown] = useToggle([false, true] as const);
    const [renderDropdown, setRenderDropdown] = useState(false);
    const dropdownButtonRef = useRef<HTMLButtonElement>(null);

    const handleDropdownToggle = useCallback(() => {
        if (!displayDropdown) {
            setRenderDropdown(true);
        } else {
            setTimeout(() => setRenderDropdown(false), 150);
        }

        queue(toggleDropdown);
    }, [displayDropdown]);

    const handleClickOutsideDropdown = useCallback(() => toggleDropdown(false), []);

    return (
        <>
            <section className={styles.serving}>
                <div className={styles.line} />
                <div className={styles.selected}>
                    <div className={styles.specific}>
                        <button onClick={decrementQuantity}>
                            <MinusIcon />
                        </button>
                        <p>
                            <input
                                className={styles.quantity}
                                value={quantity}
                                size={quantity.toString().length}
                                onChange={handleQuantityInput}
                            />
                            <span className={styles.metric}>{unit}</span>
                        </p>
                        <button onClick={incrementQuantity}>
                            <PlusIcon />
                        </button>
                    </div>
                    <input className={styles.weight} value={weight + 'g'} size={weight.toString().length + 1} onChange={handleWeightInput} />
                    <div className={styles.buttons}>
                        <button className={styles.resetScale} onClick={handleResetScale}>
                            <RefreshIcon />
                        </button>
                        <button
                            ref={dropdownButtonRef}
                            className={styles.dropdownToggle}
                            data-active={displayDropdown}
                            onClick={handleDropdownToggle}
                        >
                            <ToggleIcon />
                        </button>
                    </div>
                </div>
                <div className={styles.line} />
                {renderDropdown && (
                    <Dropdown
                        isActive={displayDropdown}
                        candidates={altServings}
                        toggleButton={dropdownButtonRef.current}
                        handleClickOutside={handleClickOutsideDropdown}
                        handleAltQuantityClick={handleAltQuantityClick(toggleDropdown)}
                    />
                )}
            </section>
        </>
    );
};

export default Serving;
