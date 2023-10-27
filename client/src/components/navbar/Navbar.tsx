import { Fragment, useCallback, useState } from 'react';
import { useTheme } from '@/hooks/common/useTheme';
import { useBreakpoints } from '@/hooks/common/useBreakpoints';
import useUser from '@/hooks/user/useUser';
import Avatar from '../common/avatar/Avatar';
import Tooltip from '../common/tooltip/Tooltip';
import { RiMarkPenLine } from 'react-icons/ri';
import { BiFoodMenu } from 'react-icons/bi';
import { FiActivity } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdOutlineCalendarMonth, MdOutlineSpaceDashboard } from 'react-icons/md';
// import { ReactComponent as Logo } from 'assets/logo.svg';
// import { ReactComponent as Logo } from 'assets/thymecard-logo.png';
import LogoLight from 'assets/thymecard-light.png';
import { TbDiamond } from 'react-icons/tb';
import { capitalize } from '@/lib/string.utils';
import styles from './navbar.module.scss';

const Navbar = () => {
    const { logoutUser } = useUser();
    const navigate = useNavigate();
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

    const handleLogout = useCallback(() => {
        logoutUser();
        navigate('/login');
    }, [logoutUser, navigate]);

    return (
        <>
            <section className={styles.navbar} data-visible={!viewport.current.isMobile || isOpen}>
                <div className={styles.logo} onClick={handleClick}>
                    {/* <Logo className={styles.logo} onClick={handleClick} /> */}
                    <img src={LogoLight} alt="thymecard" />
                </div>
                <nav>
                    <ul>
                        {LINKS.map(({ name, icon, link }) => (
                            <Fragment key={name}>
                                <li data-active={currentPage === name} data-tooltip-id={name}>
                                    <a href={link}>{icon}</a>
                                </li>
                                <Tooltip id={name} place="right">
                                    {capitalize(name)}
                                </Tooltip>
                            </Fragment>
                        ))}
                    </ul>
                </nav>
                {viewport.current.isMobile && <button className={styles.handle} onClick={() => setIsOpen(true)} />}
                <div className={styles.upgrade}>
                    <button data-tooltip-id="upgrade">
                        <TbDiamond />
                    </button>
                    <Tooltip id="upgrade" place="right" offset={20}>
                        Upgrade to Premium
                    </Tooltip>
                </div>
                <div className={styles.avatar} onClick={handleLogout}>
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
