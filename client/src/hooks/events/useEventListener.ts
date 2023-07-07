import { RefObject, useEffect } from "react";

export const useEventListener = (eventName: string, handler: (e: any) => void, ref: RefObject<Element>) => {
    useEffect(() => {
        const element = ref.current;

        if (element) {
            element.addEventListener(eventName, handler);
        }

        return () => {
            if (element) {
                element.removeEventListener(eventName, handler);
            }
        };
    }, [eventName, handler, ref.current]);
};
