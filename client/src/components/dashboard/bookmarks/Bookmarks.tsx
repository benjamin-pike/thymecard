'use client'
import { FC, useState } from 'react';
import { DateTime } from 'luxon';
import Card, { CardBody } from '@/components/common/Card';
import { DashboardCardHeader } from '../common/DashboardCardHeader';
import SliderToggle from '@/components/common/SliderToggle';
import { getOrdinalSuffix } from '@/lib/date.utils';
import styles from './bookmarks.module.css';

type Category = 'Recipes' | 'Activities';

export default () => {
    const [selectedType, setSelectedType] = useState<Category>('Recipes');

    return (
        <>
            <DashboardCardHeader titlePrefix={'Your'} titleMain={'Bookmarks'}>
                <SliderToggle
                    options={['Recipes', 'Activities']}
                    onOptionSelected={setSelectedType}
                />
            </DashboardCardHeader>
            <CardBody>
                <div className={styles.bookmarks}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Bookmark key={i} category={selectedType} name={'Pulled Pork Tacos'} calories={652} lastDate={new Date()} />
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
    lastDate: Date;
}

const Bookmark: FC<IBookmarkProps> = ({ category, name, calories, lastDate }) => {
    const lastDateFormatted =
        DateTime.fromJSDate(lastDate).year === DateTime.now().year
            ? DateTime.fromJSDate(lastDate).toFormat('MMMM d') + getOrdinalSuffix(lastDate)
            : DateTime.fromJSDate(lastDate).toLocaleString({
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
              });

    const lastDatePrefix: Record<Category, string> = {
        Recipes: 'Last made on',
        Activities: 'Last completed'
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
                {lastDatePrefix[category]} <strong>{lastDateFormatted}</strong>
            </p>
        </a>
    );
};