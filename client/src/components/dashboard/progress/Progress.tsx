import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { CardBody } from '@/components/common/card/Card';
import { DashboardCardHeader } from '../common/DashboardCardHeader';
import DayCircle from './DayCircle';
import WeekGraph from './WeekGraph';
import LongTermBars from './LongTermBars';
import { generateMockProgressData } from '@/test/mock-data/dashboard';
import styles from './progress.module.scss';

const Progress = () => {
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);
   
    const inTarget = 2000;
    const outTarget = 2500;

    const data = useMemo(
        () => generateMockProgressData(DateTime.now(), DateTime.local().ordinal),
    []);

    const [dayInValues, dayOutValues] = getDayValues(data, hoveredDay);
    const dayDelta = dayInValues.reduce((a, b) => a + b, 0) - dayOutValues.reduce((a, b) => a + b, 0);

    const [weekInValues, weekOutValues] = getWeekValues(data);

    const [monthInValues, monthOutValues] = getMonthValues(data);
    const [yearInValues, yearOutValues] = getYearValues(data);
    
    return (
        <>
            <DashboardCardHeader titlePrefix={'Your'} titleMain={'Progress'}>
                <></>
            </DashboardCardHeader>
            <CardBody>
                <div className={styles.progress}>
                    <section className={styles.day}>
                        <DayCircle type="in" target={inTarget} values={dayInValues} />
                        <DayCircle type="delta" target={inTarget - outTarget} values={[dayDelta]} />
                        <DayCircle type="out" target={outTarget} values={dayOutValues} />
                    </section>
                    <section className={styles.week}>
                        <WeekGraph
                            positiveData={weekInValues}
                            positiveTarget={inTarget}
                            negativeData={weekOutValues}
                            negativeTarget={outTarget}
                            xLabels={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
                            yInterval={Math.max(...weekInValues) + Math.max(...weekOutValues) > 6000 ? 1000 : 500}
                            strokeWidth={3}
                            aspectRatio={1}
                            hoveredDay={hoveredDay}
                            setHoveredDay={setHoveredDay}
                        />
                    </section>
                    <section className={styles.longTerm}>
                        <LongTermBars
                            dailyInTarget={inTarget}
                            dailyOutTarget={outTarget}
                            monthInValues={monthInValues}
                            monthOutValues={monthOutValues}
                            yearInValues={yearInValues}
                            yearOutValues={yearOutValues}
                        />
                    </section>
                </div>
            </CardBody>
        </>
    );
};

export default Progress;

interface ICalorieEntry {
    time: string;
    cal: number;
}

const getDayValues = (mockData: ICalorieEntry[], hoveredDay: number | null): [number[], number[]] => {
    let targetDay = DateTime.local();

    if (hoveredDay !== null) {
        const currentWeekday = targetDay.weekday - 1;
        const diff = hoveredDay - currentWeekday;

        targetDay = targetDay.plus({ days: diff });
    }

    const dayInValues: number[] = [];
    const dayOutValues: number[] = [];

    for (const entry of mockData) {
        const entryDate = DateTime.fromISO(entry.time);

        if (entryDate.hasSame(targetDay, 'day')) {
            if (entry.cal > 0) {
                dayInValues.push(entry.cal);
            } else {
                dayOutValues.push(Math.abs(entry.cal));
            }
        } else if (hoveredDay === null){
            break;
        }
    }

    return [dayInValues.reverse(), dayOutValues.reverse()];
};


const getWeekValues = (mockData: ICalorieEntry[]): [number[], number[]] => {
    const today = DateTime.local();
    const startOfWeek = today.startOf('week');

    const weekInValues: number[] = Array(7).fill(0);
    const weekOutValues: number[] = Array(7).fill(0);

    for (const entry of mockData) {
        const entryDate = DateTime.fromISO(entry.time);

        if (entryDate >= startOfWeek && entryDate <= today) {
            const dayOfWeek = entryDate.weekday - 1;
            if (entry.cal > 0) {
                weekInValues[dayOfWeek] += entry.cal;
            } else {
                weekOutValues[dayOfWeek] -= entry.cal;
            }
        }
    }

    return [weekInValues, weekOutValues];
};

const getMonthValues = (mockData: ICalorieEntry[]): [number[], number[]] => {
    const today = DateTime.local();
    const startOfMonth = today.startOf('month');

    const monthInValues: number[] = Array(today.day).fill(0);
    const monthOutValues: number[] = Array(today.day).fill(0);

    for (const entry of mockData) {
        const entryDate = DateTime.fromISO(entry.time);

        if (entryDate >= startOfMonth && entryDate <= today) {
            const dayOfMonth = entryDate.day - 1;
            if (entry.cal > 0) {
                monthInValues[dayOfMonth] += entry.cal;
            } else {
                monthOutValues[dayOfMonth] -= entry.cal;
            }
        }
    }

    return [monthInValues.filter((val) => val > 0), monthOutValues.filter((val) => val > 0)];
}

const getYearValues = (mockData: ICalorieEntry[]): [number[], number[]] => {
    const today = DateTime.local();
    const startOfYear = today.startOf('year');

    const yearInValues: number[] = Array(12).fill(0);
    const yearOutValues: number[] = Array(12).fill(0);

    for (const entry of mockData) {
        const entryDate = DateTime.fromISO(entry.time);

        if (entryDate >= startOfYear && entryDate <= today) {
            const monthOfYear = entryDate.month - 1;
            if (entry.cal > 0) {
                yearInValues[monthOfYear] += entry.cal;
            } else {
                yearOutValues[monthOfYear] -= entry.cal;
            }
        }
    }

    return [yearInValues.slice(0, today.month), yearOutValues.slice(0, today.month)];
}
