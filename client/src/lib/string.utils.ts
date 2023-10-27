export const capitalize = (str: string, allWords = true) => {
    if (allWords) {
        return str.replace(/\w\S*/g, (text: string) => {
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        });
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
};
