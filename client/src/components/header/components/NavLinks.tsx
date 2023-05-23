import { MdOutlineSpaceDashboard, MdOutlineCalendarMonth } from 'react-icons/md';
import { BiFoodMenu } from 'react-icons/bi';
import { FiActivity } from 'react-icons/fi';
import { RiMarkPenLine } from 'react-icons/ri';
import styles from './nav-links.module.css';

interface INavLinksComponentProps {
    activePage: string;
    setActivePage: (name: string) => void;
}

export const NavLinks = ({ activePage, setActivePage }: INavLinksComponentProps) => (
    <nav className={styles.links}>
        {LINKS.map(({ name, icon }) => (
            <a key={name} className={styles.link} href="#" data-active={activePage === name} onClick={() => setActivePage(name)}>
                {icon}
                <p>{name}</p>
            </a>
        ))}
    </nav>
);

const LINKS = [
    {
        name: 'dashboard',
        icon: <MdOutlineSpaceDashboard />
    },
    {
        name: 'planner',
        icon: <MdOutlineCalendarMonth />
    },
    {
        name: 'log',
        icon: <RiMarkPenLine />
    },
    {
        name: 'recipes',
        icon: <BiFoodMenu />
    },
    {
        name: 'activities',
        icon: <FiActivity />
    }
];