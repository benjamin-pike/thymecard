import { ICONS } from '@/assets/icons';
import styles from './loading-spinner.module.scss';

const Spinner = ICONS.common.loading;

const LoadingSpinner = ({ size }: { size: 'small' | 'medium' | 'large' }) => {
    return <Spinner className={styles.spinner} data-size={size} />;
};

export default LoadingSpinner;
