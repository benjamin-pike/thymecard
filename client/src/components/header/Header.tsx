import { useState, useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { Brand } from './components/Brand';
import { NavLinks } from './components/NavLinks';
import { MobileDropdownWrapper } from './components/MobileDropdownWrapper';
import { UpgradeButton } from './components/UpgradeButton';
import { Avatar } from '../common/Avatar';
import styles from './header.module.css';

export const Header = () => {
    const [activePage, setActivePage] = useState('dashboard');
    const [isMobileNavDropdownOpen, setIsMobileNavDropdownOpen] = useState(false);
    const mobileNavDropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(mobileNavDropdownRef, () => setIsMobileNavDropdownOpen(false));

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <section className={styles.left}>
                    <Brand />
                    <div className={styles.separator} />
                    <MobileDropdownWrapper
                        mobileNavDropdownRef={mobileNavDropdownRef}
                        isMobileNavDropdownOpen={isMobileNavDropdownOpen}
                        setIsMobileNavDropdownOpen={setIsMobileNavDropdownOpen}
                    >
                        <NavLinks activePage={activePage} setActivePage={setActivePage} />
                    </MobileDropdownWrapper>
                </section>
                <section className={styles.right}>
                    <UpgradeButton />
                    <Avatar />
                </section>
            </div>
        </header>
    );
};
