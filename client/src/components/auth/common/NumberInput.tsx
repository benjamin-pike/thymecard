import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { isDefined } from '@thymecard/types';
import styles from './common-input.module.scss';
import { ICONS } from '@/assets/icons';
import { queue } from '@/lib/common.utils';

const CaretIcon = ICONS.common.caret;

interface INumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'autoComplete'> {
    value: number | undefined;
    placeholder?: string;
    disabled?: boolean;
    min: number;
    max: number;
    step: number;
    buttonText?: string;
    buttonIcon?: JSX.Element;
    buttonAction?: () => void;
    buttonPopoverId?: string;
    buttonDropdownId?: string;
    handleChange?: (value: string, min?: number, max?: number) => void;
    handleFocus?: (value: string, min?: number, max?: number) => void;
    handleBlur?: (value: string, min?: number, max?: number) => void;
}

const NumberInput: FC<INumberInputProps> = ({ value, placeholder, disabled, min, max, handleChange, handleFocus, handleBlur }) => {
    const [localValue, setLocalValue] = useState<string | undefined>(isDefined(value) ? value.toString() : undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChangeWrapped = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalValue(e.target.value);
            if (handleChange) {
                handleChange(e.target.value, min, max);
            }
        },
        [handleChange, max, min]
    );

    const handleFocusWrapped = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            if (handleFocus) {
                handleFocus(e.target.value, min, max);
            }
        },
        [handleFocus, max, min]
    );

    const handleBlurWrapped = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            if (handleBlur) {
                handleBlur(e.target.value, min, max);
            }
        },
        [handleBlur, max, min]
    );

    const handleIncrement = useCallback(() => {
        if (!localValue) {
            return;
        }

        const newValue = (parseInt(localValue) + 1).toString();

        if (max && parseInt(newValue) > max) {
            console.log('handleIncrement early return');
            return;
        }

        setLocalValue(newValue);

        if (handleChange) {
            handleChange(newValue, min, max);
        }
        if (handleBlur) {
            handleBlur(newValue, min, max);
        }
    }, [handleBlur, handleChange, localValue, max, min]);

    const handleDecrement = useCallback(() => {
        if (!localValue) {
            return;
        }

        const newValue = (parseInt(localValue) - 1).toString();

        if (min && parseInt(newValue) < min) {
            return;
        }

        setLocalValue(newValue);

        if (handleChange) {
            handleChange(newValue, min, max);
        }
        if (handleBlur) {
            handleBlur(newValue, min, max);
        }
    }, [handleBlur, handleChange, localValue, max, min]);

    useEffect(() => {
        queue(() => setLocalValue(isDefined(value) ? value.toString() : undefined));
    }, [value]);

    return (
        <div className={styles.wrapper} data-type="number">
            <input
                ref={inputRef}
                value={localValue}
                type="number"
                placeholder={placeholder}
                disabled={disabled ?? false}
                min={min}
                max={max}
                step="any"
                onChange={handleChangeWrapped}
                onFocus={handleFocusWrapped}
                onBlur={handleBlurWrapped}
            />
            <p className={styles.placeholder} data-populated={isDefined(localValue)}>
                {placeholder}
            </p>
            <div className={styles.buttons}>
                <button className={styles.increment} tabIndex={-1} onClick={handleIncrement}>
                    <CaretIcon />
                </button>
                <button className={styles.decrement} tabIndex={-1} onClick={handleDecrement}>
                    <CaretIcon />
                </button>
            </div>
        </div>
    );
};

export default NumberInput;
