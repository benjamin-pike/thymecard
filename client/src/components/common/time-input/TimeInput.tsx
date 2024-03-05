import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ITime } from '@thymecard/types';
import styles from './time-input.module.scss';

interface ITimeInputProps {
    initial?: ITime;
    handleUpdate: (time: ITime) => void;
}

const TimeInput: FC<ITimeInputProps> = ({ initial, handleUpdate }) => {
    const [time, setTime] = useState({
        hours: initial ? String(initial.hours).padStart(2, '0') : '',
        minutes: initial ? String(initial.minutes).padStart(2, '0') : ''
    });

    const hourInputRef = useRef<HTMLInputElement>(null);
    const minuteInputRef = useRef<HTMLInputElement>(null);

    const [hourWidth, setHourWidth] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (value.length <= 2) {
            const parsedValue = parseInt(value);
            let newValue = value;

            if (name === 'hours' && parsedValue > 23) {
                newValue = '23';
            }

            if (name === 'minutes' && parsedValue > 59) {
                newValue = '59';
            }

            if (parsedValue < 0) {
                newValue = '0';
            }

            setTime({ ...time, [name]: newValue });
        }

        if (name === 'hours') {
            if (value.length === 2) {
                minuteInputRef.current?.focus();
            }
        }
    };

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            const { name, value } = e.target;

            if (value.length === 1) {
                setTime({ ...time, [name]: `0${value}` });
            }
        },
        [time]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('handleKeyDown', e.key);
        const { name, value, selectionStart } = e.currentTarget;

        if (name === 'hours' && e.key === 'ArrowRight' && selectionStart === value.length) {
            const minuteInput = minuteInputRef.current;

            if (minuteInput) {
                e.preventDefault();

                minuteInput.focus();
                minuteInput.setSelectionRange(0, 0);
            }
        }

        console.log(name, selectionStart);
        if (name === 'minutes' && selectionStart === 0) {
            if (e.key === 'ArrowLeft') {
                const hourInput = hourInputRef.current;

                if (hourInput) {
                    e.preventDefault();

                    hourInput.focus();
                }
            }

            if (e.key === 'Backspace') {
                const hourInput = hourInputRef.current;

                if (hourInput) {
                    e.preventDefault();

                    hourInput.focus();
                    hourInput.setSelectionRange(1, 1);

                    setTime({ ...time, hours: time.hours.slice(0, -1) });
                }
            }
        }
    };

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        const input = target.closest('input');

        if (!input) {
            const hourInput = hourInputRef.current;
            if (hourInput) {
                hourInput.focus();
            }
        }
    };

    useEffect(() => {
        if (!hourInputRef.current) {
            return;
        }

        if (time.hours.length === 0) {
            setHourWidth(null);
        } else {
            const input = hourInputRef.current;
            const font = getInputFont(input);

            setHourWidth(getTextWidth(time.hours, font));
        }
    }, [time, time.hours]);

    useEffect(() => {
        handleUpdate({ hours: parseInt(time.hours), minutes: parseInt(time.minutes) });
    }, [time, handleUpdate]);

    return (
        <div className={styles.input} onClick={handleContainerClick}>
            <input
                ref={hourInputRef}
                name="hours"
                value={time.hours}
                min={0}
                max={23}
                placeholder="00"
                autoComplete="off"
                maxLength={2}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={hourWidth ? { width: `${hourWidth}px` } : {}}
            />
            <span data-placeholder-visible={!time.hours && !time.minutes}>:</span>
            <input
                ref={minuteInputRef}
                name="minutes"
                value={time.minutes}
                min={0}
                max={59}
                placeholder="00"
                autoComplete="off"
                maxLength={2}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default TimeInput;

const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        return 0;
    }

    context.font = font;

    return context.measureText(text).width;
};

const getStyle = (element: HTMLElement, property: string) => {
    return window.getComputedStyle(element, null).getPropertyValue(property);
};

const getInputFont = (input: HTMLInputElement) => {
    const fontWeight = getStyle(input, 'font-weight') || 'normal';
    const fontSize = getStyle(input, 'font-size') || '16px';
    const fontFamily = getStyle(input, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
};
