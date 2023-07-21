'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWindowResize } from '@/hooks/events/useWindowResize';

import Card from '@/components/common/card/Card';
import Feed from '@/components/dashboard/feed/Feed';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import DrawerWrapper, { IDrawerWrapperProps } from '@/components/wrappers/drawer/DrawerWrapper';
import OverviewCardContent from 'components/dashboard/overview/Overview';
import ProgressCardContent from 'components/dashboard/progress/Progress';
import DayCardContent from 'components/dashboard/day/Day';
import BookmarksCardContent from 'components/dashboard/bookmarks/Bookmarks';
import Footer from '@/components/common/footer/Footer';

import { useBreakpoints } from '@/hooks/dom/useBreakpoints';
import { formatClasses } from '@/lib/common.utils';
import { CgProfile } from 'react-icons/cg';
import { CgCalendarToday } from 'react-icons/cg';
import { MdDataUsage } from 'react-icons/md';
import { BiBookmarkAlt } from 'react-icons/bi';

import styles from './dashboard.module.scss';

const Dashboard = () => {
    const viewport = useBreakpoints([
        { name: 'compressed', min: 0, max: 600 },
        { name: 'feedOnly', min: 601, max: 850 },
        { name: 'unregulated', min: 851 }
    ]);
    const [visibleCard, setVisibleCard] = useState<string | null>(null);

    const initialColumns = window.innerWidth > 1200 ? 3 : window.innerWidth > 768 ? 2 : window.innerWidth > 480 ? 1 : 0;
    const [columns, setColumns] = useState(initialColumns);

    const displayMobileNav = columns === 0 || columns === 1;

    const toggleCard = useCallback(
        (cardName: string) => {
            if (visibleCard) {
                if (visibleCard === cardName) {
                    setVisibleCard(null);
                    return;
                }

                setVisibleCard(null);
                setTimeout(() => {
                    setVisibleCard(cardName);
                }, 200);
            } else {
                setVisibleCard(cardName);
            }
        },
        [visibleCard]
    );

    const hideCard = useCallback(() => {
        if (!visibleCard) return;

        setVisibleCard(null);
    }, [visibleCard]);

    useWindowResize(hideCard);

    useEffect(() => {
        const viewportColumnMapping = new Map([
            ['isFeedOnly', 1],
            ['isMedium', 2],
            ['isLarge', 2],
            ['isXLarge', 3]
        ]);

        for (const [viewportType, columnCount] of viewportColumnMapping) {
            if (viewport.current[viewportType]) {
                if (columns !== columnCount) {
                    console.log('viewportType', viewportType, 'columnCount', columnCount);
                    setColumns(columnCount);
                }
                return;
            }
        }

        if (columns !== 0) {
            setColumns(0);
        }
    }, [viewport, columns]);


    const buildDrawerWrapperProps = useCallback(
        (cardName: string): Omit<IDrawerWrapperProps, 'children'> => ({
            direction: 'bottom',
            transitionDuration: 200,
            margin: { closed: -0.5, open: 0 },
            isVisible: visibleCard === cardName,
            isActive: displayMobileNav,
            closeDrawer: hideCard
        }),
        [visibleCard, displayMobileNav, hideCard]
    );

    const overviewDrawerWrapperProps = useMemo(() => buildDrawerWrapperProps('overview'), [buildDrawerWrapperProps]);
    const progressDrawerWrapperProps = useMemo(() => buildDrawerWrapperProps('progress'), [buildDrawerWrapperProps]);
    const dayDrawerWrapperProps = useMemo(() => buildDrawerWrapperProps('day'), [buildDrawerWrapperProps]);
    const bookmarksDrawerWrapperProps = useMemo(() => buildDrawerWrapperProps('bookmarks'), [buildDrawerWrapperProps]);

    const buildScrollbarWrapperProps = useCallback(
        (columnName: string, active: boolean) => ({
            className: formatClasses(styles, ['wrapper', columnName]),
            height: '100svh',
            buttonMargin: { down: displayMobileNav ? 'calc(3.5rem + 1px)' : undefined },
            padding: 2,
            active
        }),
        [displayMobileNav]
    );

    const feedScrollbarWrapperProps = useMemo(
        () => buildScrollbarWrapperProps('feed', !viewport.current.isCompressed),
        [buildScrollbarWrapperProps, viewport]
    );
    const profileAndOrganizationScrollbarWrapperProps = useMemo(
        () => buildScrollbarWrapperProps('profile', columns === 2),
        [buildScrollbarWrapperProps, columns]
    );
    const profileScrollbarWrapperProps = useMemo(
        () => buildScrollbarWrapperProps('profile', columns === 3),
        [buildScrollbarWrapperProps, columns]
    );
    const organizationScrollbarWrapperProps = useMemo(
        () => buildScrollbarWrapperProps('organization', columns === 3),
        [buildScrollbarWrapperProps, columns]
    );

    const ProgressCard = useMemo(
        () => (
            <Card className={formatClasses(styles, ['card', 'progress', visibleCard === 'progress' ? 'visible' : ''])}>
                <ProgressCardContent />
            </Card>
        ),
        [visibleCard]
    );

    const OverviewCard = useMemo(
        () => (
            <Card className={formatClasses(styles, ['card', 'overview', visibleCard === 'overview' ? 'visible' : ''])}>
                <OverviewCardContent />
            </Card>
        ),
        [visibleCard]
    );

    const DayCard = useMemo(
        () => (
            <Card className={formatClasses(styles, ['card', 'day', visibleCard === 'day' ? 'visible' : ''])}>
                <DayCardContent />
            </Card>
        ),
        [visibleCard]
    );

    const BookmarksCard = useMemo(
        () => (
            <Card className={formatClasses(styles, ['card', 'bookmarks', visibleCard === 'bookmarks' ? 'visible' : ''])}>
                <BookmarksCardContent />
            </Card>
        ),
        [visibleCard]
    );

    return (
        <main className={styles.content}>
            <ScrollWrapper {...feedScrollbarWrapperProps} useAutoScroll>
                <div className={formatClasses(styles, ['column', 'feed'])}>
                    <Feed />
                </div>
            </ScrollWrapper>
            <ScrollWrapper {...profileAndOrganizationScrollbarWrapperProps}>
                <>
                    <ScrollWrapper {...profileScrollbarWrapperProps}>
                        <div className={formatClasses(styles, ['column', 'profile'])}>
                            <DrawerWrapper {...overviewDrawerWrapperProps}>{OverviewCard}</DrawerWrapper>
                            <DrawerWrapper {...progressDrawerWrapperProps}>{ProgressCard}</DrawerWrapper>
                        </div>
                    </ScrollWrapper>
                    <ScrollWrapper {...organizationScrollbarWrapperProps}>
                        <div className={formatClasses(styles, ['column', 'organization'])}>
                            <DrawerWrapper {...dayDrawerWrapperProps}>{DayCard}</DrawerWrapper>
                            <DrawerWrapper {...bookmarksDrawerWrapperProps}>{BookmarksCard}</DrawerWrapper>
                            <Footer />
                        </div>
                    </ScrollWrapper>
                </>
            </ScrollWrapper>
            <section className={formatClasses(styles, ['navbar', visibleCard ? 'visibleCard' : ''])}>
                <button onClick={() => toggleCard('overview')}>
                    <CgProfile />
                    <p>Overview</p>
                </button>
                <div className={styles.divider} />
                <button onClick={() => toggleCard('progress')}>
                    <MdDataUsage />
                    <p>Progress</p>
                </button>
                <div className={styles.divider} />
                <button onClick={() => toggleCard('day')}>
                    <CgCalendarToday />
                    <p>Day</p>
                </button>
                <div className={styles.divider} />
                <button onClick={() => toggleCard('bookmarks')}>
                    <BiBookmarkAlt />
                    <p>Bookmarks</p>
                </button>
            </section>
            <div className={styles.fader} />
        </main>
    );
};

export default Dashboard;
