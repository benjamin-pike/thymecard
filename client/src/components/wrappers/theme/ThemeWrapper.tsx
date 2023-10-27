import { FC, ReactElement } from 'react';
import styles from './theme-wrapper.module.scss';
import { useTheme } from '@/hooks/common/useTheme';

interface IThemeWrapperProps {
    children: ReactElement;
}

const ThemeWrapper: FC<IThemeWrapperProps> = ({ children }) => {
    const { theme } = useTheme();
    return (
        <div className={styles.wrapper} data-theme={theme}>
            {children}
        </div>
    );
};

export default ThemeWrapper;
