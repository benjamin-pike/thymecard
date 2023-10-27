export const formatClasses = (styles: Record<string, string>, classNames: string[]) => {
    return classNames
        .filter(Boolean)
        .map((className) => styles[className])
        .join(' ');
};

export const xor = (...args: boolean[]) => args.filter((_) => _).length === 1;

export const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const queue = (fn: () => void) => {
    setTimeout(fn, 0);
};
