import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { MdOutlineSpaceDashboard, MdOutlineCalendarMonth } from 'react-icons/md';
import { BiFoodMenu } from 'react-icons/bi';
import { FiActivity } from 'react-icons/fi';
import { RiMarkPenLine } from 'react-icons/ri';
import styles from './nav-links.module.scss';

const NavLinks: FC = () => {
    const location = useLocation()
    const currentPage = location.pathname.split('/')[1];
    return (
        <nav className={styles.links}>
            {LINKS.map(({ name, icon, link }) => (
                <a key={name} className={styles.link} href={link} data-active={currentPage === name}>
                    {icon}
                    <p>{name}</p>
                </a>
            ))}
        </nav>
    );
};

export default NavLinks;

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
        link: '#'
    },
    {
        name: 'activities',
        icon: <FiActivity />,
        link: '#'
    }
];
