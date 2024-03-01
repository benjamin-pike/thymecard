import { EEventType } from '@thymecard/types';

export interface IEvent {
    time: string;
    type: EEventType;
    name: string;
    duration: number;
}
