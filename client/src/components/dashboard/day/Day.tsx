import { FC } from 'react';
import { DateTime } from 'luxon';
import { CardBody } from '@/components/common/card/Card';
import { DashboardCardHeader } from '../common/DashboardCardHeader';
import Event from './Event';
import { generateMockPlannerData } from '@/test/mock-data/planner';
import styles from './day.module.scss';

const today = DateTime.now().toFormat('yyyy-MM-dd');
const ordinal = DateTime.now().ordinal;
const data = generateMockPlannerData(today, today, ordinal, 0.9)[today];

const Day: FC = () => {
    return (
        <>
            <DashboardCardHeader titlePrefix={'Your'} titleMain={'Day'}>
                <>
                    <p className={styles.datetime}>
                        <span>{DateTime.local().toFormat('HH:mm')}</span>
                        {'   •   '}
                        <span>{DateTime.local().toFormat('EEEE d LLLL')}</span>
                    </p>
                </>
            </DashboardCardHeader>
            <CardBody>
                <div className={styles.events}>
                    {data.map(({ type, time, name }, i) => (
                        <Event key={i} type={type} time={time} name={name} />
                    ))}
                </div>
            </CardBody>
        </>
    );
};

export default Day;
