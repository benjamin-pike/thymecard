import Logo from '@/assets/logo.svg';
import styles from './brand.module.css';

export const Brand = () => (
    <>
        <Logo className={styles.logo} />
        <h1 className={styles.brand}>serona</h1>
    </>
);