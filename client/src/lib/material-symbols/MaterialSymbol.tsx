import { FC } from 'react';
import 'material-symbols';
import styles from './material-symbol.module.scss';

interface IMaterialSymbolProps {
    icon: string;
    style: 'outlined' | 'rounded' | 'sharp'
}

export const MaterialSymbol: FC<IMaterialSymbolProps> = ({ icon, style }) => {
    return <span className={`${styles.symbol} material-symbols-${style}`}>{icon}</span>;
};