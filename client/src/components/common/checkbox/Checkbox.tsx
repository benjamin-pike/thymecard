import { FC } from 'react';
import styles from './checkbox.module.scss';

interface ICheckboxProps {
    id: string;
    checked: boolean;
    onClick: () => void;
}

const Checkbox: FC<ICheckboxProps> = ({ id, checked, onClick }) => {
    return (
        <div className={styles.checkbox}>
            <input type="checkbox" id={id} checked={checked} />
            <button onClick={onClick}>
                <svg viewBox="0 0 24 24">
                    <polyline points="4 12 9 17 20 6"></polyline>
                </svg>
            </button>
        </div>
    );
};

export default Checkbox;
