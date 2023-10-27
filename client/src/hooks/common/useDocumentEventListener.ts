import { useEffect } from 'react';

export const useDocumentEventListener = (eventName: string, handler: (e: any) => void) => {
    useEffect(() => {
        document.addEventListener(eventName, handler);

        return () => {
            document.removeEventListener(eventName, handler);
        };
    }, [eventName, handler]);
};
