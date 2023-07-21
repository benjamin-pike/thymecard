import { FC, ReactElement, memo } from 'react';
import { CardHeader } from '@/components/common/card/Card';
import styles from './dashboard-card-header.module.scss';

interface IDashboardCardHeaderProps {
    children: ReactElement;
    titlePrefix?: string;
    titleMain: string;
    titleSuffix?: string;
}

export const DashboardCardHeader: FC<IDashboardCardHeaderProps> = memo(({ children, titlePrefix, titleMain, titleSuffix }) => {
    return (
        <CardHeader>
            <>
                <h1 className={styles.cardTitle}>
                    <span className={styles.cardTitlePrefix}>{titlePrefix ?? ''}</span> {titleMain}{' '}
                    <span className={styles.cardTitleSuffix}>{titleSuffix ?? ''}</span>
                </h1>
                <div className={styles.cardHeaderFeature}>{children}</div>
            </>
        </CardHeader>
    );
});
