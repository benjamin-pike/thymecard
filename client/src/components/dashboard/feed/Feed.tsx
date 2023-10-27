'use client';
import { FC, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '@mantine/hooks';

import FeedDay from './FeedDay';
import FeedEvent from './FeedEvent';
import LoadingDots from '@/components/common/loading-dots/LoadingDots';

import { generateMockFeedData } from '@/test/mock-data/dashboard';

import styles from './feed.module.scss';

const mockData = generateMockFeedData(30);

const fetchData = async (page: number) => {
    const entriesPerPage = 3;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return mockData.slice((page - 1) * entriesPerPage, page * entriesPerPage);
};

const Feed: FC = () => {
    const { data, fetchNextPage } = useInfiniteQuery(['feed'], async ({ pageParam = 1 }) => await fetchData(pageParam), {
        getNextPageParam: (_, pages) => {
            return pages.length + 1;
        },
        initialData: {
            pages: [mockData.slice(0, 3)],
            pageParams: [1]
        }
    });

    const { ref, entry } = useIntersection({
        root: document.body,
        threshold: 1
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry, fetchNextPage]);

    return (
        <>
            {data?.pages.map((page, pageIndex) => (
                <>
                    {page.map(({ date, events }, dayIndex) => (
                        <FeedDay key={`${pageIndex}-${dayIndex}`} date={date}>
                            <>
                                {events.map((event, eventIndex) => (
                                    <FeedEvent key={`${pageIndex}-${dayIndex}-${eventIndex}`} {...event} />
                                ))}
                            </>
                        </FeedDay>
                    ))}
                </>
            ))}
            <div ref={ref} className={styles.loadingDots}>
                <LoadingDots />
            </div>
        </>
    );
};

export default Feed;
