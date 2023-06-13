'use client';
import { useCallback, useState } from 'react';
import { useWindowResize } from '@/hooks/useWindowResize';
import Header from '@/components/header/Header';
import Card from '@/components/common/Card';
import Feed from '@/components/dashboard/feed/Feed';
import OverviewCardContent from '@/components/dashboard/overview/Overview';
import ProgressCardContent from '@/components/dashboard/progress/Progress';
import DayCardContent from '../../components/dashboard/day/Day';
import BookmarksCardContent from '../../components/dashboard/bookmarks/Bookmarks';
import Footer from '@/components/common/Footer';
import { formatClasses } from '@/lib/common.utils';
import { CgProfile } from 'react-icons/cg';
import { CgCalendarToday } from 'react-icons/cg';
import { MdDataUsage } from 'react-icons/md';
import { BiBookmarkAlt } from 'react-icons/bi';
import styles from './dashboard.module.css';

const Dashboard = () => {
    const [visibleCard, setVisibleCard] = useState<string | null>(null);

    const toggleCard = useCallback((cardName: string) => {
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
    }, [visibleCard]);

    useWindowResize(() => setVisibleCard(null));

    return (
        <>
            <Header />
            <main className={styles.content}>
                <div className={formatClasses(styles, ['column', 'left'])}>
                    <Card className={formatClasses(styles, ['card', 'day', visibleCard === 'day' ? 'visible' : ''])}>
                        <DayCardContent />
                    </Card>
                    <Card className={formatClasses(styles, ['card', 'bookmarks', visibleCard === 'bookmarks' ? 'visible' : ''])}>
                        <BookmarksCardContent />
                    </Card>
                    <Footer />
                </div>
                <div className={formatClasses(styles, ['column', 'center'])}>
                    <Feed />
                </div>
                <div className={formatClasses(styles, ['column', 'right'])}>
                    <Card className={formatClasses(styles, ['card', 'overview', visibleCard === 'overview' ? 'visible' : ''])}>
                        <OverviewCardContent />
                    </Card>
                    <Card className={formatClasses(styles, ['card', 'progress', visibleCard === 'progress' ? 'visible' : ''])}>
                        <ProgressCardContent />
                    </Card>
                </div>
                <section className={formatClasses(styles, ['mobileNav', visibleCard ? 'visibleCard' : ''])}>
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
        </>
    );
};

export default Dashboard;
