import { useState } from 'react';
import Card, { CardBody } from '@/components/common/Card';
import SliderToggle from '@/components/common/SliderToggle';
import LatestEvent from './LatestEvent';
import { formatClasses } from '@/lib/common.utils';
import { Avatar } from '@/components/common/Avatar';
import styles from './overview.module.css';

type Interval = 'Week' | 'Month' | 'Year' | 'All Time';

export default () => {
    const [selectedInterval, setSelectedInterval] = useState<Interval>('Week');
    return (
        <>
            <Avatar className={styles.profileImage} />
            <CardBody>
                <article className={styles.overview}>
                    <h1 className={styles.title}>
                        <span>Your</span> Overview
                    </h1>
                    <SliderToggle options={['Week', 'Month', 'Year', 'All Time']} onOptionSelected={setSelectedInterval} />
                    <section className={styles.completed}>
                        <div className={styles.meals}>
                            <p className={styles.value}>674</p>
                            <p className={styles.type}>
                                Meals
                                <br />
                                Consumed
                            </p>
                        </div>
                        <div className={formatClasses(styles, ['divider', 'vertical'])} />
                        <div className={styles.activities}>
                            <p className={styles.value}>456</p>
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
                            <p className={styles.value}>23.6k</p>
                            <p className={styles.type}>Calories In</p>
                        </div>
                        <div className={styles.delta}>
                            <p className={styles.value}>-2.8k</p>
                            <p className={styles.type}>Delta</p>
                        </div>
                        <div className={styles.out}>
                            <p className={styles.value}>26.4k</p>
                            <p className={styles.type}>Calories Out</p>
                        </div>
                    </section>
                    <section className={styles.latest}>
                        <LatestEvent category={'Meal'} name={'Pulled Pork Tacos'} calories={652} lastDate={new Date()} />
                        <LatestEvent category={'Activity'} name={'Evening Walk'} calories={-1430} lastDate={new Date()} />
                    </section>
                </article>
            </CardBody>
        </>
    );
};
