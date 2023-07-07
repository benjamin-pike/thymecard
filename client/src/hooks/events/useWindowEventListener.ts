import { useEffect } from "react";

export const useWindowEventListener = (eventName: string, handler: (e: any) => void) => {
    useEffect(() => {
        window.addEventListener(eventName, handler);

        return () => {
            window.removeEventListener(eventName, handler);
        };
    }, [eventName, handler]);
};
