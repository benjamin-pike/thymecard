import { useCallback, useRef } from 'react';

export const usePopover = () => {
    const closeFunctionRef = useRef<() => void>(() => {
        throw new Error('closeFunctionRef is not defined');
    });

    const bindCloseFunction = useCallback((closeFunction: () => void) => {
        closeFunctionRef.current = closeFunction;
    }, []);

    const closePopover = useCallback(() => {
        closeFunctionRef.current();
    }, []);

    return { bindCloseFunction, closePopover };
};
