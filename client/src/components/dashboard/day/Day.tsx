import { FC } from 'react';
import { DateTime } from 'luxon';
import { CardBody } from '@/components/common/Card';
import { DashboardCardHeader } from '../common/DashboardCardHeader';
import Event, { IEventProps } from './Event';
import styles from './day.module.css';

const events: IEventProps[] = [
    { type: 'Breakfast', time: new Date('2023-05-26T08:30'), name: 'Pancakes with Lemon Juice and Sugar' },
    { type: 'Lunch', time: new Date('3023-05-26T13:45'), name: 'Chicken Caesar Salad and Tomato Soup' },
    { type: 'Walk', time: new Date('3023-05-26T17:15'), name: 'Walk in Shotover Park' },
    { type: 'Dinner', time: new Date('3023-05-26T20:00'), name: 'Pulled Pork Burritos with Guacamole' }
];

const Day: FC = () => {
    return (
        <>
            <DashboardCardHeader titlePrefix={'Your'} titleMain={'Day'}>
                <p className={styles.currentTime}>{DateTime.local().toFormat('HH:mm')}</p>
                <p className={styles.currentDate}>{DateTime.local().toFormat('EEE dd LLL')}</p>
            </DashboardCardHeader>
            <CardBody>
                <div className={styles.events}>
                    {events.map(({ type, time, name }, i) => (
                        <Event key={i} type={type} time={time} name={name} />
                    ))}
                </div>
            </CardBody>
        </>
    );
};

export default Day;