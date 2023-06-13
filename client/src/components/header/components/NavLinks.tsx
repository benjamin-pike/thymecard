import { FC } from 'react';
import { MdOutlineSpaceDashboard, MdOutlineCalendarMonth } from 'react-icons/md';
import { BiFoodMenu } from 'react-icons/bi';
import { FiActivity } from 'react-icons/fi';
import { RiMarkPenLine } from 'react-icons/ri';
import styles from './nav-links.module.css';

interface INavLinksComponentProps {
    activePage: string;
    setActivePage: (name: string) => void;
}

const NavLinks: FC<INavLinksComponentProps> = ({ activePage, setActivePage }) => (
    <nav className={styles.links}>
        {LINKS.map(({ name, icon, link }) => (
            <a key={name} className={styles.link} href={link} data-active={activePage === name} onClick={() => setActivePage(name)}>
                {icon}
                <p>{name}</p>
            </a>
        ))}
    </nav>
);

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