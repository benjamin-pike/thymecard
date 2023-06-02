import React, { useEffect, useState, useRef, CSSProperties } from 'react';
import styles from './slider-toggle.module.css';

interface ISliderToggleProps<T> {
    options: T[];
    type?: 'basic' | 'asymmetrical';
    defaultOption?: T;
    onOptionSelected: (option: T) => void;
}

type RefRecord<T> = Record<string, React.RefObject<T>>;

const SliderToggle = <T extends string = string>({ options, type, defaultOption, onOptionSelected }: ISliderToggleProps<T>) => {
    const [selectedOption, setSelectedOption] = useState<T>(defaultOption || options[0]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const buttonRefs: RefRecord<HTMLButtonElement> = options.reduce<RefRecord<HTMLButtonElement>>((acc, option) => {
        acc[option] = React.useRef<HTMLButtonElement>(null);
        return acc;
    }, {});

    useEffect(() => {
        const slider = sliderRef.current;
        const selectedButton = buttonRefs[selectedOption].current;

        let buttonWidths = [];
        for (const [buttonName, buttonElement] of Object.entries(buttonRefs)) {
            if (buttonName === selectedOption) {
                break;
            }

            buttonWidths.push(buttonElement.current?.offsetWidth ?? 0);
        }
        const baseOffset = buttonWidths.reduce((acc, width) => acc + width, 0);

        if (slider && selectedButton) {
            const sliderStyle: CSSProperties = {
                width: `${selectedButton.offsetWidth}px`,
                translate: `calc(${baseOffset}px + ${0.25 * buttonWidths.length}rem)`
            };

            Object.assign(slider.style, sliderStyle);
        }

        onOptionSelected(selectedOption);
    }, [selectedOption]);

    return (
        <div className={styles.selector} data-is-asymmetrical={type === 'asymmetrical'}>
            <div ref={sliderRef} className={styles.slider} />
            {options.map((option) => (
                <button
                    ref={buttonRefs[option]}
                    className={styles.buttons}
                    onClick={() => setSelectedOption(option)}
                    data-is-selected={selectedOption === option}
                    key={option}
                >
                    <p>{option}</p>
                </button>
            ))}
        </div>
    );
};

export default SliderToggle;
