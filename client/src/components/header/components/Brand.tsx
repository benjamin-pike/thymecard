import Logo from '@/assets/logo.svg';
import styles from './brand.module.css';

const Brand = () => (
    <>
        <Logo className={styles.logo} />
        <h1 className={styles.brand}>serona</h1>
    </>
);

export default Brand;