import { FC, ReactElement, useCallback } from 'react';
import styles from './auth-section.module.scss';
import { isDefined } from '@thymecard/types';

interface IAuthSectionProps {
    children: ReactElement;
    stage: number;
    currentTransition?: [number, number];
}

const AuthSection: FC<IAuthSectionProps> = ({ children, stage, currentTransition }) => {
    const isTransitioning = isDefined(currentTransition);
    const isReverse = isTransitioning && currentTransition[0] > currentTransition[1];
    const relativeStage = currentTransition && Math.max(...currentTransition) === stage ? 'higher' : 'lower';

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }, []);

    return (
        <form
            className={styles.section}
            data-stage={isTransitioning ? relativeStage : undefined}
            data-reverse={isTransitioning ? isReverse : undefined}
            onKeyDown={handleKeyDown}
            onSubmit={handleSubmit}
        >
            {children}
        </form>
    );
};

export default AuthSection;
