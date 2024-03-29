/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';

export const useMount = (callback: () => void) => {
    useEffect(() => {
        setTimeout(() => {
            callback();
        });
    }, []);
};
