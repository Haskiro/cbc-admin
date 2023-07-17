export const withTimeout = (callback: (...args: any) => any, delay = 500) => {
    setTimeout(callback, delay);
}