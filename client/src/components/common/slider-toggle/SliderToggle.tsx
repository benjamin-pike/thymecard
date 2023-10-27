import { useEffect, useRef, CSSProperties, useState } from 'react';
import useLocalStorage from '@/hooks/common/useLocalStorage';
import styles from './slider-toggle.module.scss';

interface ISliderToggleProps<T extends string = string> {
    localStorageKey: string;
    options: T[];
    labels: Record<T, string>;
    defaultOption?: T;
    onOptionSelected: (option: T) => void;
}

const SliderToggle = <T extends string = string>({
    localStorageKey,
    options,
    labels,
    defaultOption,
    onOptionSelected
}: ISliderToggleProps<T>) => {
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [selectedOption, setSelectedOption] = useLocalStorage(localStorageKey, defaultOption ?? options[0]);
    const sliderRef = useRef<HTMLDivElement>(null);

    const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    useEffect(() => {
        const slider = sliderRef.current;
        const selectedButton = buttonRefs.current[selectedOption];

        const buttonWidths = [];
        for (const [buttonName, buttonElement] of Object.entries(buttonRefs.current)) {
            if (buttonName === selectedOption) {
                break;
            }

            buttonWidths.push(buttonElement?.offsetWidth ?? 0);
        }
        const baseOffset = buttonWidths.reduce((acc, width) => acc + width, 0);

        if (slider && selectedButton) {
            const sliderStyle: CSSProperties = {
                width: `${selectedButton.offsetWidth}px`,
                translate: `calc(${baseOffset}px + ${0.25 * buttonWidths.length}rem)`,
                transition: isInitialRender ? 'none' : 'width 200ms ease, translate 200ms ease'
            };

            Object.assign(slider.style, sliderStyle);

            if (isInitialRender) {
                setIsInitialRender(false);
            }
        }

        onOptionSelected(selectedOption as T);
    }, [selectedOption, isInitialRender, buttonRefs, onOptionSelected]);

    return (
        <div className={styles.selector}>
            <div ref={sliderRef} className={styles.slider} />
            {options.map((option) => (
                <button
                    ref={(el) => {
                        buttonRefs.current[option] = el;
                    }}
                    className={styles.button}
                    onClick={() => setSelectedOption(option)}
                    data-is-selected={selectedOption === option}
                    key={option}
                >
                    <p>{labels[option]}</p>
                </button>
            ))}
        </div>
    );
};

export default SliderToggle;
