import { FC } from 'react';
import styles from './text-skeleton.module.scss';

interface ITextSkeletonProps {
    className?: string;
    fontSize?: number;
    width?: string;
}

const TextSkeleton: FC<ITextSkeletonProps> = ({ className, fontSize, width }) => {
    const cn = className ? `${styles.skeleton} ${className}` : styles.skeleton;

    const height = 1.25 * (fontSize || 1);

    const borderRadius = `${height / 3}rem`;

    return <span className={cn} style={{ height: `${height}rem`, width, borderRadius }} />;
};

export default TextSkeleton;
