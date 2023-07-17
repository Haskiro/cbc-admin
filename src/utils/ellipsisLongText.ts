export const ellipsisLongText = (text: string, length: number): string => {
    if (text.length > length) {
        return text.substring(0, length - 2).trim() + "...";
    } else return text;
}