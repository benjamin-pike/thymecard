import { EEventType } from '@thymecard/types';

export interface IFeedEventProps {
    type: EEventType;
    time: Date;
    location?: string;
    rating?: number;
    name: string;
    metrics: {
        primary: IPrimaryMetric;
        secondary: ISecondaryMetric[];
    };
    journal?: string;
    visuals?: string[];
}

export interface IFeedData {
    date: Date;
    events: IFeedEventProps[];
}

export interface IPrimaryMetric {
    measurement: 'calories';
    value: number;
}

export interface ISecondaryMetric {
    measurement: 'carbs' | 'fat' | 'protein';
    value: number;
}
