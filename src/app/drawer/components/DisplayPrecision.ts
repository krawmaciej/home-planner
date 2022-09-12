
const FLOAT_POINT_NUMBER = 1;

const FLOAT_FACTOR = Math.pow(10, FLOAT_POINT_NUMBER);

export const convertFromAppUnitsToCm = (value: number): string => {
    return (Math.round(value * 10 * FLOAT_FACTOR) / FLOAT_FACTOR).toString() + "cm";
};

export const convertFromAppUnitsToM = (value: number): string => {
    return (Math.round(value / 10 * FLOAT_FACTOR) / FLOAT_FACTOR).toString() + "m";
};
