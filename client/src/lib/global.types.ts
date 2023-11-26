import { EventType } from '@thymecard/types';

export interface IEvent {
    time: string;
    type: EventType;
    name: string;
    duration: number;
}
