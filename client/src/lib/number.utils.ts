export const abbreviateNumber = (num: number): string => {
    if (Math.abs(num) >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'm';
    }
    if (Math.abs(num) >= 1_000) {
        return (num / 1_000).toFixed(1) + 'k';
    }

    return num.toString();
};

export const round = (num: number, dp: number) => {
    const factor = Math.pow(10, dp);
    return Math.round(num * factor) / factor;
};
