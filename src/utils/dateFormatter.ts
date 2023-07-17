export const dateFormatter = (date: Date): string => {
    const year = date.getFullYear().toString();
    const day = date.getDate() < 10 ? '0' + date.getDate() :  date.getDate().toString();
    const month = date.getMonth() < 10 ? '0' + date.getMonth() :  date.getMonth().toString();

    return `${day}.${month}.${year}`
}