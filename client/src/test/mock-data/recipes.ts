import { srngFloat } from '@/lib/random.utils';
import NUTRITIONAL_INFO from './data/nutritional-info.json';

export const generateNutitionalInfo = () => {
    return [...NUTRITIONAL_INFO].sort((a, b) => 0.5 - srngFloat([a.code.toString(), b.code.toString()])).slice(0, 15);
};
