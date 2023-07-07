import { useEffect, useRef, CSSProperties } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { useSuppressTransitionsOnMount } from '@/hooks/lifecycle/useSuppressTransitionsOnMount';
import styles from './slider-toggle.module.scss';

interface ISliderToggleProps<T extends string = string> {
    localStorageKey: string;
    options: T[];
    labels: Record<T, string>;
    defaultOption?: T;
    onOptionSelected: (option: T) => void;
}

type RefRecord<T> = Record<string, React.RefObject<T>>;

const SliderToggle = <T extends string = string>({ localStorageKey, options, labels, defaultOption, onOptionSelected }: ISliderToggleProps<T>) => {
    const [selectedOption, setSelectedOption] = useLocalStorage({ key: localStorageKey, defaultValue: defaultOption ?? options[0] });
    const sliderRef = useSuppressTransitionsOnMount();
    const buttonRefs: RefRecord<HTMLButtonElement> = options.reduce<RefRecord<HTMLButtonElement>>((acc, option) => {
        acc[option] = useRef<HTMLButtonElement>(null);
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

        onOptionSelected(selectedOption as T);
    }, [selectedOption]);

    return (
        <div className={styles.selector}>
            <div ref={sliderRef} className={styles.slider} />
            {options.map((option) => (
                <button
                    ref={buttonRefs[option]}
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
