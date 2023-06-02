'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/header/Header';
import Card from '@/components/common/Card';
import Feed from '@/components/dashboard/feed/Feed';
import OverviewCardContent from '@/components/dashboard/overview/Overview';
import ProgressCardContent from '@/components/dashboard/progress/Progress';
import DayCardContent from '../../components/dashboard/day/Day';
import BookmarksCardContent from '../../components/dashboard/bookmarks/Bookmarks';
import { formatClasses } from '@/lib/common.utils';
import { CgProfile } from 'react-icons/cg';
import { SlGraph } from 'react-icons/sl';
import { FiSun } from 'react-icons/fi';
import { BiBookmarks } from 'react-icons/bi';
import styles from './dashboard.module.css';
import Footer from '@/components/common/Footer';

const Dashboard = () => {
    // const [overviewCardIsVisible, setOverviewCardIsVisible] = useState(false);
    // const [progressCardIsVisible, setProgressCardIsVisible] = useState(false);
    // const [dayCardIsVisible, setDayCardIsVisible] = useState(false);
    // const [bookmarksCardIsVisible, setBookmarksCardIsVisible] = useState(false);

    // const popupIsVisible = overviewCardIsVisible || progressCardIsVisible || dayCardIsVisible || bookmarksCardIsVisible;

    const [visibleCard, setVisibleCard] = useState<string | null>(null);

    const toggleCard = (cardName: string) => {
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
    };

    useEffect(() => {
        const handleResize = () => {
            setVisibleCard(null);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setVisibleCard]);

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
                <section className={styles.mobileNav}>
                    <button onClick={() => toggleCard('overview')}>
                        <CgProfile />
                        <p>Overview</p>
                    </button>
                    <button onClick={() => toggleCard('progress')}>
                        <SlGraph />
                        <p>Progress</p>
                    </button>
                    <button onClick={() => toggleCard('day')}>
                        <FiSun />
                        <p>Day</p>
                    </button>
                    <button onClick={() => toggleCard('bookmarks')}>
                        <BiBookmarks />
                        <p>Bookmarks</p>
                    </button>
                </section>
                <div
                    className={`${styles.mobilePopupBackdrop} ${visibleCard ? styles.visible : styles.hidden}`}
                    onClick={() => setVisibleCard(null)}
                />
            </main>
        </>
    );
};

export default Dashboard;
