'use client';
import { FC, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { CardBody } from '@/components/common/card/Card';
import { DashboardCardHeader } from '../common/DashboardCardHeader';
import SliderToggle from '@/components/common/slider-toggle/SliderToggle';
import { getOrdinalSuffix } from '@/lib/date.utils';
import { generateMockBookmarksData } from '@/test/mock-data/dashboard';
import styles from './bookmarks.module.scss';

type Category = 'recipes' | 'activities';

export default () => {
    const [selectedType, setSelectedType] = useState<Category>('recipes');

    const data = useMemo(() => generateMockBookmarksData(10), []);

    return (
        <>
            <DashboardCardHeader titlePrefix={'Your'} titleMain={'Bookmarks'}>
                <SliderToggle
                    localStorageKey = {'bookmarks'}
                    options={['recipes', 'activities']}
                    labels={{ recipes: 'Recipes', activities: 'Activities' }}
                    onOptionSelected={setSelectedType}
                />
            </DashboardCardHeader>
            <CardBody>
                <div className={styles.bookmarks}>
                    {data[selectedType].map(({ name, calories, lastCompleted }, i) => (
                        <Bookmark key={i} category={selectedType} name={name} calories={calories} lastCompleted={lastCompleted} />
                    ))}
                </div>
            </CardBody>
        </>
    );
};

interface IBookmarkProps {
    category: Category;
    name: string;
    calories: number;
    lastCompleted: string;
}

const Bookmark: FC<IBookmarkProps> = ({ category, name, calories, lastCompleted }) => {
    const lastCompletedDate = DateTime.fromISO(lastCompleted);
    const formattedDate =
        lastCompletedDate.year === DateTime.now().year
            ? lastCompletedDate.toFormat('MMMM d') + getOrdinalSuffix(lastCompletedDate)
            : lastCompletedDate.toLocaleString({
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
              });

    const lastDatePrefix: Record<Category, string> = {
        recipes: 'Last made on',
        activities: 'Last completed'
    };

    return (
        <a className={styles.bookmark}>
            <h1 className={styles.name}>{name}</h1>
            <p className={styles.calories}>
                <strong>
                    {calories < 0 ? '−' : '+'}
                    {Math.abs(calories)}
                </strong>{' '}
                calories
            </p>
            <p className={styles.lastDate}>
                {lastDatePrefix[category]} <strong>{formattedDate}</strong>
            </p>
        </a>
    );
};
