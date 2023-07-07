import { useEffect, RefObject } from 'react';

export const useMutationObserver = (ref: RefObject<Node>, callback: MutationCallback, options?: MutationObserverInit) => {
    useEffect(() => {
        const node = ref.current;

        if (node) {
            const observer = new MutationObserver(callback);
            observer.observe(node, options);

            return () => {
                observer.disconnect();
            };
        }
    }, [ref, callback, options]);
};
