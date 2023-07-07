export type EventType = 'breakfast' | 'snack' | 'activity' | 'lunch' | 'drink' | 'dinner' | 'dessert';

export interface IEvent {
    time: string;
    type: EventType;
    name: string;
    duration: number;
}
