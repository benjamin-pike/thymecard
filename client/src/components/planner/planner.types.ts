import { IEvent } from '@/lib/global.types';

export type PlannerData = Record<string, IEvent[]>;

export enum EEventDisplayFormat {
    COMPACT = 'compact',
    SIMPLE = 'simple',
    STRIP = 'strip',
    EXPANDED = 'expanded'
}
