export const formatClasses = (styles: Record<string, string>, classNames: string[]) => {
    return classNames.filter(Boolean).map(className => styles[className]).join(' ');
}

export const xor = (...args: boolean[]) => args.filter(_ => _).length === 1;