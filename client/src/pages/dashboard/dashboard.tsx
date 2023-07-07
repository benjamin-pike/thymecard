'use client';
import { useCallback, useState } from 'react';
import { useWindowResize } from '@/hooks/events/useWindowResize';

import Card from '@/components/common/card/Card';
import Feed from '@/components/dashboard/feed/Feed';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import DrawerWrapper from '@/components/wrappers/drawer/DrawerWrapper';
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
    const viewport = useBreakpoints();
    const [visibleCard, setVisibleCard] = useState<string | null>(null);

    const initialColumns = window.innerWidth > 1200 ? 3 : window.innerWidth > 768 ? 2 : window.innerWidth > 480 ? 1 : 0;
    const [columns, setColumns] = useState(initialColumns);

    const displayMobileNav = columns === 1 || columns === 0;

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

    const checkColumns = useCallback(() => {
        const viewportColumnMapping = new Map([
            ['isXLarge', 3],
            ['isLarge', 2],
            ['isMedium', 2],
            ['isSmall', 1]
        ]);

        for (const [viewportType, columnCount] of viewportColumnMapping) {
            if (viewport.current[viewportType]) {
                if (columns !== columnCount) {
                    setColumns(columnCount);
                }
                return;
            }
        }

        if (columns !== 0) {
            setColumns(0);
        }
    }, [viewport, columns]);

    const buildDrawerWrapperProps = (cardName: string) =>
        ({
            direction: 'bottom',
            transitionDuration: 200,
            margin: { closed: -0.5, open: 0 },
            isVisible: visibleCard === cardName,
            isActive: displayMobileNav,
            closeDrawer: hideCard
        } as const);

    useWindowResize(hideCard);
    useWindowResize(checkColumns);

    const buildScrollbarWrapperProps = (columnName: string, active: boolean) => ({
        className: formatClasses(styles, ['wrapper', columnName]),
        height: 'calc(100svh - 4rem)',
        buttonMargin: { down: displayMobileNav ? 'calc(3.5rem + 1px)' : undefined },
        padding: 2,
        active
    });

    return (
        <main className={styles.content}>
            <ScrollWrapper {...buildScrollbarWrapperProps('feed', columns !== 0)} useAutoScroll>
                <div className={formatClasses(styles, ['column', 'feed'])}>
                    <Feed />
                </div>
            </ScrollWrapper>
            <ScrollWrapper {...buildScrollbarWrapperProps('profile', columns === 2)}>
                <>
                    <ScrollWrapper {...buildScrollbarWrapperProps('profile', columns === 3)}>
                        <div className={formatClasses(styles, ['column', 'profile'])}>
                            <DrawerWrapper {...buildDrawerWrapperProps('overview')}>
                                <Card className={formatClasses(styles, ['card', 'overview', visibleCard === 'overview' ? 'visible' : ''])}>
                                    <OverviewCardContent />
                                </Card>
                            </DrawerWrapper>
                            <DrawerWrapper {...buildDrawerWrapperProps('progress')}>
                                <Card className={formatClasses(styles, ['card', 'progress', visibleCard === 'progress' ? 'visible' : ''])}>
                                    <ProgressCardContent />
                                </Card>
                            </DrawerWrapper>
                        </div>
                    </ScrollWrapper>
                    <ScrollWrapper {...buildScrollbarWrapperProps('organization', columns === 3)}>
                        <div className={formatClasses(styles, ['column', 'organization'])}>
                            <DrawerWrapper {...buildDrawerWrapperProps('day')}>
                                <Card className={formatClasses(styles, ['card', 'day', visibleCard === 'day' ? 'visible' : ''])}>
                                    <DayCardContent />
                                </Card>
                            </DrawerWrapper>
                            <DrawerWrapper {...buildDrawerWrapperProps('bookmarks')}>
                                <Card
                                    className={formatClasses(styles, ['card', 'bookmarks', visibleCard === 'bookmarks' ? 'visible' : ''])}
                                >
                                    <BookmarksCardContent />
                                </Card>
                            </DrawerWrapper>
                            <Footer />
                        </div>
                    </ScrollWrapper>
                </>
            </ScrollWrapper>
            <section className={formatClasses(styles, ['navbar', visibleCard ? 'visibleCard' : ''])}>
                <button onClick={() => toggleCard('overview')}>
                    <CgProfile />
                </button>
                <div className={styles.divider} />
                <button onClick={() => toggleCard('progress')}>
                    <MdDataUsage />
                </button>
                <div className={styles.divider} />
                <button onClick={() => toggleCard('day')}>
                    <CgCalendarToday />
                </button>
                <div className={styles.divider} />
                <button onClick={() => toggleCard('bookmarks')}>
                    <BiBookmarkAlt />
                </button>
            </section>
            <div className={styles.fader} />
            <div
                className={`${styles.mobilePopupBackdrop} ${visibleCard ? styles.visible : styles.hidden}`}
                onClick={() => setVisibleCard(null)}
            />
        </main>
    );
};

export default Dashboard;
