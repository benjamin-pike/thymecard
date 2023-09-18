import { ToastOptions, toast } from 'react-toastify';
import { ICONS } from '@/assets/icons';
import styles from './toast.module.scss';

const TickIcon = ICONS.common.tick;
const CrossIcon = ICONS.common.XLarge;
const IIcon = ICONS.common.info;

type Type = 'success' | 'error' | 'warning' | 'info';

export const createToast = (type: Type, message: string, options?: ToastOptions) => {
    const icon = (() => {
        switch (type) {
            case 'success':
                return <SuccessIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return null;
            case 'info':
                return <InfoIcon />;
        }
    })()

    const mergedOptions = {
        className: `${styles.toast} ${styles[type]}`,
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: false,
        icon,
        ...options,
    };

    switch (type) {
        case 'success':
            return toast.success(message, mergedOptions);
        case 'error':
            return toast.error(message, mergedOptions);
        case 'warning':
            return toast.warn(message, mergedOptions);
        case 'info':
            return toast.info(message, mergedOptions);
    }
};

const SuccessIcon = () => (
    <div className={styles.icon} data-type='success'>
        <TickIcon />
    </div>
);

const ErrorIcon = () => (
    <div className={styles.icon} data-type='error'>
        <CrossIcon />
    </div>
);

const InfoIcon = () => (
    <div className={styles.icon} data-type='info'>
        <IIcon />
    </div>
);

