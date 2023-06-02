import { FC } from 'react';
import { DateTime } from 'luxon';
import EventIcon from '../common/EventIcon';
import { EventType } from '../dashboard.types';
import { formatClasses } from '@/lib/common.utils';
import styles from './event.module.css';

export interface IEventProps {
    type: EventType;
    time: Date;
    name: string;
}

const Event: FC<IEventProps> = ({ type, time, name }) => {
    const formattedTime = DateTime.fromJSDate(time).toFormat('HH:mm');
    const isPast = DateTime.fromJSDate(time) < DateTime.local();
    return (
        <div className={formatClasses(styles, ['event', type.toLowerCase(), isPast ? 'past' : ''])}>
            <div className={styles.icon}>
                <EventIcon 
                    type={type} 
                    radius={1.25}
                    background={true}
                />
            </div>
            <div className={styles.details}>
                <div className={styles.chips}>
                    <p className={styles.time}>{formattedTime}</p>
                    <p className={styles.type}>{type}</p>
                </div>
                <p className={styles.name}>{name}</p>
            </div>
        </div>
    );
};

export default Event;
