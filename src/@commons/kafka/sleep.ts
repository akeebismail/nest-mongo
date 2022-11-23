export const sleep = (timeout: number) => {
    return new Promise<void>((resolve) => setTimeout(resolve, timeout));
};

export const retry = (callback: () => Promise<void>, times: number = 3, timeout: number = 2500) => {
    let numberOfTries = 0;
    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            numberOfTries++;
            if (numberOfTries === times) {
                clearInterval(interval);
            }
            try {
                await callback();
                clearInterval(interval);
                resolve(true);
            } catch (err) {
            }
        }, timeout);
    });
};