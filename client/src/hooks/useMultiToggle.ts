import { useState } from 'react';

type OptionUnion<T extends readonly (string | number)[]> = T[number];

export const useMultiToggle = <T extends readonly (string | number)[]>(options: T, initialIndex?: number): [OptionUnion<T>, () => void] => {
    if (options.length === 0) {
        throw new Error('useMultiToggle requires at least one option');
    }

    if (initialIndex !== undefined && (initialIndex < 0 || initialIndex >= options.length)) {
        throw new Error('initialIndex is out of bounds');
    }

    const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);

    const toggle = () => {
        setCurrentIndex(currentIndex === options.length - 1 ? 0 : currentIndex + 1);
    };

    return [options[currentIndex] as OptionUnion<T>, toggle];
};
