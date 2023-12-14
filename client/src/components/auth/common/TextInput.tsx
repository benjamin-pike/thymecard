import { FC, useCallback, useState } from 'react';
import { isDefined } from '@thymecard/types';
import styles from './common-input.module.scss';

interface ITextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children' | 'autoComplete'> {
    value: string | undefined;
    error?: boolean;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    autoComplete?: boolean;
    buttonText?: string;
    buttonIcon?: JSX.Element;
    buttonAction?: () => void;
    buttonPopoverId?: string;
    buttonDropdownId?: string;
    handleChange?: (value: string) => void;
    handleFocus?: (value: string) => void;
    handleBlur?: (value: string) => void;
    handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput: FC<ITextInputProps> = ({
    value,
    error,
    placeholder,
    type,
    disabled,
    autoComplete,
    buttonText,
    buttonIcon,
    buttonAction,
    buttonPopoverId,
    buttonDropdownId,
    handleChange,
    handleKeyDown,
    handleFocus,
    handleBlur
}) => {
    if (buttonText && buttonIcon) {
        throw new Error('TextInput cannot have both buttonText and buttonIcon');
    }

    const [isFocused, setIsFocused] = useState(false);

    const displayButton = isDefined(buttonText) || isDefined(buttonIcon);

    const handleChangeWrapped = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (handleChange) {
                handleChange(e.target.value);
            }
        },
        [handleChange]
    );

    const handleFocusWrapped = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (handleFocus) {
                handleFocus(e.target.value);
            }
        },
        [handleFocus]
    );

    const handleBlurWrapped = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (handleBlur) {
                handleBlur(e.target.value);
            }
        },
        [handleBlur]
    );

    return (
        <div
            className={styles.wrapper}
            data-error={error}
            data-has-button={displayButton}
            data-button-type={isDefined(buttonText) ? 'text' : 'icon'}
        >
            <input
                value={value}
                autoComplete={autoComplete !== false ? 'on' : 'new-password'}
                type={type ? type : 'text'}
                placeholder={placeholder}
                disabled={disabled ?? false}
                onChange={handleChangeWrapped}
                onFocus={handleFocusWrapped}
                onBlur={handleBlurWrapped}
                onKeyDown={handleKeyDown}
            />
            <p className={styles.placeholder} data-populated={!!value || (type === 'date' && isFocused)}>
                {placeholder}
            </p>
            {displayButton && (
                <button tab-index={-1} data-popover-id={buttonPopoverId} data-dropdown-id={buttonDropdownId} onClick={buttonAction}>
                    {isDefined(buttonText) && <p>{buttonText}</p>}
                    {isDefined(buttonIcon) && buttonIcon}
                </button>
            )}
        </div>
    );
};

export default TextInput;
