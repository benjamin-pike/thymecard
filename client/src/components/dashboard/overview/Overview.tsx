import { useMemo } from 'react';
import useLocalStorage from '@/hooks/common/useLocalStorage';

import { CardBody } from '@/components/common/card/Card';
import Avatar from '@/components/common/avatar/Avatar';
import SliderToggle from '@/components/common/slider-toggle/SliderToggle';
import LatestEvent from './LatestEvent';

import { formatClasses } from '@/lib/common.utils';
import { abbreviateNumber } from '@/lib/number.utils';
import { generateMockLatestEventData, generateMockOverviewData } from '@/test/mock-data/dashboard';

import styles from './overview.module.scss';

type Interval = 'week' | 'month' | 'year' | 'allTime';

const Overview = () => {
    const [selectedInterval, setSelectedInterval] = useLocalStorage<Interval>('overview', 'week');

    const numericData = useMemo(() => generateMockOverviewData(), []);
    const selectedNumericData = numericData[selectedInterval];

    const eventData = useMemo(() => generateMockLatestEventData(), []);

    return (
        <>
            <Avatar className={styles.profileImage} />
            <CardBody>
                <article className={styles.overview}>
                    <h1 className={styles.title}>
                        <span>Your</span> Overview
                    </h1>
                    <SliderToggle
                        localStorageKey={'overview'}
                        options={['week', 'month', 'year', 'allTime']}
                        labels={{ week: 'Week', month: 'Month', year: 'Year', allTime: 'All Time' }}
                        onOptionSelected={setSelectedInterval}
                    />
                    <section className={styles.completed}>
                        <div className={styles.meals}>
                            <p className={styles.type}>
                                Portions
                                <br />
                                Consumed
                            </p>
                            <p className={styles.value}>{selectedNumericData.events.meals}</p>
                        </div>
                        <div className={formatClasses(styles, ['divider', 'vertical'])} />
                        <div className={styles.activities}>
                            <p className={styles.value}>{selectedNumericData.events.activities}</p>
                            <p className={styles.type}>
                                Activities
                                <br />
                                Completed
                            </p>
                        </div>
                    </section>
                    <div className={formatClasses(styles, ['divider', 'horizontal'])} />
                    <section className={styles.calories}>
                        <div className={styles.in}>
                            <p className={styles.value}>{abbreviateNumber(selectedNumericData.calories.in)}</p>
                            <p className={styles.type}>Calories In</p>
                        </div>
                        <div className={styles.delta}>
                            <p className={styles.value}>
                                {abbreviateNumber(selectedNumericData.calories.in - selectedNumericData.calories.out)}
                            </p>
                            <p className={styles.type}>Delta</p>
                        </div>
                        <div className={styles.out}>
                            <p className={styles.value}>{abbreviateNumber(selectedNumericData.calories.out)}</p>
                            <p className={styles.type}>Calories Out</p>
                        </div>
                    </section>
                    <section className={styles.latest}>
                        <LatestEvent
                            category={'Meal'}
                            name={eventData.meals.name}
                            calories={eventData.meals.calories}
                            lastCompleted={eventData.meals.lastCompleted}
                        />
                        <LatestEvent
                            category={'Activity'}
                            name={eventData.activities.name}
                            calories={eventData.activities.calories}
                            lastCompleted={eventData.activities.lastCompleted}
                        />
                    </section>
                </article>
            </CardBody>
        </>
    );
};

export default Overview;
