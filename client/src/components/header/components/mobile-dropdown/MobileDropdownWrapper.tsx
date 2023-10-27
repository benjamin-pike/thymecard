import { FC, ReactElement, useCallback, useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useClickOutside } from '@mantine/hooks';
import styles from './mobile-dropdown-wrapper.module.scss';

interface IMobileDropdownComponentProps {
    children: ReactElement;
}

const MobileDropdownWrapper: FC<IMobileDropdownComponentProps> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        setIsVisible(!isVisible);
    }, [isVisible]);

    const closeDropdown = useCallback(() => {
        setIsVisible(false);
    }, []);

    const ref = useClickOutside(closeDropdown);

    return (
        <div ref={ref} className={styles.mobileNavDropdownWrapper}>
            <button className={styles.mobileNavDropdownButton} onClick={toggleVisibility}>
                <RxHamburgerMenu />
            </button>
            <div className={styles.mobileNavDropdownContainer} data-dropdown-is-open={isVisible}>
                {children}
            </div>
        </div>
    );
};

export default MobileDropdownWrapper;
