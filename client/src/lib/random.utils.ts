import seedrandom from 'seedrandom';
import { DateTime } from 'luxon';

export const srngFloat = (seeds: string[]): number => {
    const today = DateTime.local().toFormat('yyyyMMdd');
    const rng = seedrandom([today, ...seeds].join());

    return rng();
};

export const srngInt = (lower: number, upper: number, seeds: string[]): number => {
    return Math.floor(srngFloat(seeds) * (upper - lower + 1)) + lower;
}