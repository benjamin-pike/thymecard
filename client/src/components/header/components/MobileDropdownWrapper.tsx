import { ReactNode } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import styles from './mobile-dropdown-wrapper.module.css';

interface IMobileDropdownComponentProps {
    children: ReactNode;
    mobileNavDropdownRef: React.RefObject<HTMLDivElement>;
    isMobileNavDropdownOpen: boolean;
    setIsMobileNavDropdownOpen: (isOpen: boolean) => void;
}

export const MobileDropdownWrapper = ({
    children,
    mobileNavDropdownRef,
    isMobileNavDropdownOpen,
    setIsMobileNavDropdownOpen
}: IMobileDropdownComponentProps) => (
    <div className={styles.mobileNavDropdownWrapper}>
        <button className={styles.mobileNavDropdownButton} onClick={() => setIsMobileNavDropdownOpen(!isMobileNavDropdownOpen)}>
            <RxHamburgerMenu />
        </button>
        <div ref={mobileNavDropdownRef} className={styles.mobileNavDropdownContainer} data-dropdown-is-open={isMobileNavDropdownOpen}>
            {children}
        </div>
    </div>
);