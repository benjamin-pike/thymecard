import { DateTime } from 'luxon';

export const getOrdinalSuffix = (date: Date) => {
    const dt = DateTime.fromJSDate(date);
    const day = dt.day;
    
    if (day > 3 && day < 21) return 'th';  
    if (day % 10 == 1) return 'st';
    if (day % 10 == 2) return 'nd';
    if (day % 10 == 3) return 'rd';
    
    return 'th'
}