import useUser from '@/hooks/user/useUser';
import styles from './avatar.module.scss';

const Avatar = ({ className }: { className?: string }) => {
    const { user } = useUser();

    return <img className={`${styles.avatar}${className ? ` ${className}` : ''}`} src={user?.image} alt="avatar" />;
};

export default Avatar;
