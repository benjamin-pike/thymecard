import { MdOutlineCalendarMonth, MdOutlineSpaceDashboard } from 'react-icons/md';
import { ReactComponent as Logo } from 'assets/logo.svg';
import styles from './navbar.module.scss';
import { RiMarkPenLine } from 'react-icons/ri';
import { BiFoodMenu } from 'react-icons/bi';
import { FiActivity } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Avatar from '../common/avatar/Avatar';
import { TbDiamond } from 'react-icons/tb';
import { useBreakpoints } from '@/hooks/dom/useBreakpoints';

const Navbar = () => {
    const viewport = useBreakpoints();
    const { toggleTheme } = useTheme();

    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const currentPage = location.pathname.split('/')[1];

    const handleClick = useCallback(() => {
        document.body.classList.add('no-transition');
        toggleTheme();
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 100);
    }, [toggleTheme]);

    return (
        <>
            <section className={styles.navbar} data-visible={!viewport.current.isMobile || isOpen}>
                <div className={styles.logo}>
                    <Logo className={styles.logo} onClick={handleClick} />
                </div>
                <nav>
                    <ul>
                        {LINKS.map(({ name, icon, link }) => (
                            <li key={name} data-active={currentPage === name}>
                                <a href={link}>{icon}</a>
                            </li>
                        ))}
                    </ul>
                </nav>
                {viewport.current.isMobile && <button className={styles.handle} onClick={() => setIsOpen(true)} />}
                <div className={styles.upgrade}>
                    <button>
                        <TbDiamond />
                    </button>
                </div>
                <div className={styles.avatar}>
                    <Avatar className={styles.image} />
                </div>
            </section>
            <div className={styles.backdrop} data-visible={viewport.current.isMobile && isOpen} onClick={() => setIsOpen(false)} />
        </>
    );
};

export default Navbar;

const LINKS = [
    {
        name: 'dashboard',
        icon: <MdOutlineSpaceDashboard />,
        link: '/dashboard'
    },
    {
        name: 'planner',
        icon: <MdOutlineCalendarMonth />,
        link: '/planner'
    },
    {
        name: 'log',
        icon: <RiMarkPenLine />,
        link: '#'
    },
    {
        name: 'recipes',
        icon: <BiFoodMenu />,
        link: 'recipes'
    },
    {
        name: 'activities',
        icon: <FiActivity />,
        link: '#'
    }
];
