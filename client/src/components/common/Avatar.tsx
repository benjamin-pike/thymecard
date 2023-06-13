import styles from './avatar.module.css';

const Avatar = ({ className }: { className?: string }) => (
    <img
        className={`${styles.avatar}${className ? ` ${className}` : ''}`}
        src="https://media.licdn.com/dms/image/C5603AQFjdurPwiVQ5Q/profile-displayphoto-shrink_100_100/0/1629318607609?e=1690416000&v=beta&t=1FxrDV86YRX9Zkgm1_xz64IVjc-CgcMoEdKeDoDZ_nA"
        alt="avatar"
    />
);

export default Avatar;