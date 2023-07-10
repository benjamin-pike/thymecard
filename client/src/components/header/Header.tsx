import Brand from './components/brand/Brand';
import NavLinks from './components/nav-links/NavLinks';
import MobileDropdownWrapper from './components/mobile-dropdown/MobileDropdownWrapper';
import UpgradeButton from './components/upgrade-button/UpgradeButton';
import Avatar from '../common/avatar/Avatar';
import styles from './header.module.scss';
import usePremium from '@/hooks/usePremium';

const Header = () => {
    const isPremium = usePremium();

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <section className={styles.left}>
                    <Brand />
                    <div className={styles.separator} />
                    <MobileDropdownWrapper>
                        <NavLinks />
                    </MobileDropdownWrapper>
                </section>
                <section className={styles.right}>
                    {!isPremium && <UpgradeButton />}
                    <Avatar />
                </section>
            </div>
        </header>
    );
};

export default Header;
