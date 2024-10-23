export const generateRandomValue = (min: number, max: number, fixed = 0) => {
    const randomValue = Math.random() * (max - min) + min;
    if (fixed) return parseFloat(randomValue.toFixed(fixed));
    else return Math.floor(randomValue);
}

export const log = (logs: string[], text: string) => {
    logs.push(text);
    console.log(text);
}