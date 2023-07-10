import styles from './upgrade-button.module.scss';
import { TbDiamond } from 'react-icons/tb';

const UpgradeButton = () => (
    <button className={styles.upgradeButton}>
        <TbDiamond />
        <p>Premium</p>
    </button>
);

export default UpgradeButton;
