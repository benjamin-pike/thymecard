import { EventType } from "../dashboard.types";

export interface IFeedEventProps {
    type: EventType;
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

interface IPrimaryMetric {
    measurement: 'calories';
    value: number;
}

interface ISecondaryMetric {
    measurement: 'carbs' | 'fat' | 'protein';
    value: number;
}