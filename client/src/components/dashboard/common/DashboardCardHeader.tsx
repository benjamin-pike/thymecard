import { FC, ReactNode } from 'react';
import { CardHeader } from '@/components/common/Card';
import styles from './dashboard-card-header.module.css';

interface IDashboardCardHeaderProps {
    children: ReactNode;
    titlePrefix?: string;
    titleMain: string;
    titleSuffix?: string;
}

export const DashboardCardHeader: FC<IDashboardCardHeaderProps> = ({ children, titlePrefix, titleMain, titleSuffix }) => {
    return (
        <CardHeader>
            <h1 className={styles.cardTitle}>
                <span className={styles.cardTitlePrefix}>{titlePrefix ?? ''}</span> {titleMain}{' '}
                <span className={styles.cardTitleSuffix}>{titleSuffix ?? ''}</span>
            </h1>
            <div className={styles.cardHeaderFeature}>{children}</div>
        </CardHeader>
    );
};
