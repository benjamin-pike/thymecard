import { FC } from 'react';
import styles from './title.module.scss';

interface ITitleProps {
    text: string;
}

const Title: FC<ITitleProps> = ({ text }) => {
    return <h2 className={styles.title}>{text}</h2>;
};

export default Title;
