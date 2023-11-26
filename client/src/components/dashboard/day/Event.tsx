import { FC } from 'react';
import { DateTime } from 'luxon';
import EventIcon from '../../common/event-icon/EventIcon';
import { EventType } from '@thymecard/types';
import { formatClasses } from '@/lib/common.utils';
import { capitalize } from '@/lib/string.utils';
import styles from './event.module.scss';

export interface IEventProps {
    type: EventType;
    time: string;
    name: string;
}

const Event: FC<IEventProps> = ({ type, time, name }) => {
    const formattedTime = DateTime.fromISO(time).toFormat('HH:mm');
    const isPast = DateTime.fromISO(time) < DateTime.local();
    return (
        <div className={formatClasses(styles, ['event', type.toLowerCase(), isPast ? 'past' : ''])}>
            <div className={styles.icon}>
                <EventIcon type={type} radius={1.25} background={true} />
            </div>
            <div className={styles.details}>
                <div className={styles.chips}>
                    <p className={styles.time}>{formattedTime}</p>
                    <p className={styles.type}>{capitalize(type)}</p>
                </div>
                <p className={styles.name}>{name}</p>
            </div>
        </div>
    );
};

export default Event;
