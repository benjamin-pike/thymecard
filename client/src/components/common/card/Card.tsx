import { FC, ReactElement } from "react";
import styles from './card.module.scss';

interface ICardComponentProps {
    children?: ReactElement;
    className?: string;
}

const Card: FC<ICardComponentProps> = ({ children, className }) => {
    return (
        <article className = {`${styles.card}${className ? ' ' + className : ''}`}>
            {children}
        </article>
    );
}

export default Card;

export const CardHeader: FC<ICardComponentProps> = ({ children, className }) => {
    return (
        <header className = {`${styles.cardHeader}${className ? ' ' + className : ''}`}>
            {children}
        </header>
    );
}

export const CardBody: FC<ICardComponentProps> = ({ children, className }) => {
    return (
        <article className = {`${styles.cardBody}${className ? ' ' + className : ''}`}>
            {children}
        </article>
    );
}