import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { EStockSection } from '@thymecard/types';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';
import styles from './header.module.scss';
import { useStock } from '../StockProvider';

const FridgeIcon = ICONS.recipes.fridge;
const ShoppingIcon = ICONS.recipes.shopping;
const StarIcon = ICONS.common.star;
const PlanIcon = ICONS.common.planner;

const SECTIONS = [
    {
        name: EStockSection.PANTRY,
        label: 'Pantry',
        icon: <FridgeIcon />
    },
    {
        name: EStockSection.SHOPPING_LIST,
        label: 'Shopping List',
        icon: <ShoppingIcon />
    },
    {
        name: EStockSection.FAVORITES,
        label: 'Favorites',
        icon: <StarIcon />
    }
] as const;

interface IHeaderProps {
    handleToggleVisibleInfo: () => void;
}

const Header: FC<IHeaderProps> = ({ handleToggleVisibleInfo }) => {
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);
    const { selectedSection, handleSelectSection } = useStock();

    const [barWidth, setBarWidth] = useState(0);
    const [barMarginLeft, setBarMarginLeft] = useState(0);
    const [isInitialRender, setIsInitialRender] = useState(true);

    const barRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<Record<EStockSection, HTMLButtonElement | null>>({
        [EStockSection.PANTRY]: null,
        [EStockSection.SHOPPING_LIST]: null,
        [EStockSection.FAVORITES]: null
    });

    const displaySwitchViewButton = customViewportSize === 'twoColumns';

    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, section: EStockSection) => {
        const target = e.currentTarget as HTMLButtonElement;
        const { width, left } = target.getBoundingClientRect();
        const { left: containerLeft } = target.parentElement?.getBoundingClientRect() as DOMRect;

        if (selectedSection === section) return;

        handleSelectSection(section);
        setBarWidth(barWidth + width);

        const sections = Object.values(EStockSection);
        if (sections.indexOf(section) < sections.indexOf(selectedSection)) {
            setBarMarginLeft(left - containerLeft);
        }
        setTimeout(() => {
            setBarWidth(width);
            setBarMarginLeft(left - containerLeft);
        }, 150);
    };

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;
        bar.style.transition = isInitialRender ? 'none' : 'margin-left 200ms ease, width 200ms ease';
    }, [isInitialRender, selectedSection]);

    useEffect(() => {
        const target = sectionsRef.current[selectedSection];

        if (!target) {
            return;
        }

        const { width, left } = target.getBoundingClientRect();
        const { left: containerLeft } = target.parentElement?.getBoundingClientRect() as DOMRect;

        setBarWidth(width);
        setBarMarginLeft(left - containerLeft);

        setIsInitialRender(false);
    }, [selectedSection, sectionsRef]);

    return (
        <header className={styles.header}>
            <div className={styles.tabs}>
                {SECTIONS.map((section, i, arr) => (
                    <>
                        <button
                            key={section.name}
                            ref={(el) => (sectionsRef.current[section.name] = el)}
                            data-name={section.name}
                            onClick={(e) => handleTabClick(e, section.name)}
                        >
                            {section.icon}
                            <span>{capitalize(section.label)}</span>
                        </button>
                        {i !== arr.length - 1 && <div className={styles.divider} />}
                    </>
                ))}
                <div
                    ref={barRef}
                    className={styles.bar}
                    style={{
                        width: barWidth,
                        marginLeft: barMarginLeft
                    }}
                />
            </div>
            <div className={styles.buttons}>
                {displaySwitchViewButton && (
                    <button className={styles.switchView} onClick={handleToggleVisibleInfo}>
                        <PlanIcon />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
