import { useCallback, useRef } from 'react';

export const useDropdown = () => {
    const closeFunctionRef = useRef<() => void>(() => {
        throw new Error('closeFunctionRef is not defined');
    });

    const bindCloseFunction = useCallback((closeFunction: () => void) => {
        closeFunctionRef.current = closeFunction;
    }, []);

    const closeDropdown = useCallback(() => {
        closeFunctionRef.current();
    }, []);

    return { bindCloseFunction, closeDropdown };
};
