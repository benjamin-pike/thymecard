import { useTheme } from '@/hooks/common/useTheme';
import { ReactComponent as Logo } from 'assets/logo.svg';
import { useCallback } from 'react';
import styles from './brand.module.scss';

const Brand = () => {
    const { toggleTheme } = useTheme();

    const handleClick = useCallback(() => {
        document.body.classList.add('no-transition');
        toggleTheme();
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 100);
    }, [toggleTheme]);

    return (
        <>
            <Logo className={styles.logo} onClick={handleClick} />
            <h1 className={styles.brand}>thymecard</h1>
        </>
    );
};

export default Brand;
