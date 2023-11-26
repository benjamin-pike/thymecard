import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { StockSection } from '@thymecard/types';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';
import styles from './header.module.scss';

const FridgeIcon = ICONS.recipes.fridge;
const ShoppingListIcon = ICONS.recipes.tickList;
const StarIcon = ICONS.common.star;
const PlanIcon = ICONS.common.planner;

const SECTIONS = [
    {
        name: StockSection.PANTRY,
        label: 'Pantry',
        icon: <FridgeIcon />
    },
    {
        name: StockSection.SHOPPING_LIST,
        label: 'Shopping List',
        icon: <ShoppingListIcon />
    },
    {
        name: StockSection.FAVORITES,
        label: 'Favorites',
        icon: <StarIcon />
    }
] as const;

interface IHeaderProps {
    selectedSection: StockSection;
    setSelectedSection: (section: StockSection) => void;
    handleToggleVisibleInfo: () => void;
}

const Header: FC<IHeaderProps> = ({ selectedSection, setSelectedSection, handleToggleVisibleInfo }) => {
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);

    const [barWidth, setBarWidth] = useState(0);
    const [barMarginLeft, setBarMarginLeft] = useState(0);
    const [isInitialRender, setIsInitialRender] = useState(true);

    const barRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<Record<StockSection, HTMLButtonElement | null>>({
        [StockSection.PANTRY]: null,
        [StockSection.SHOPPING_LIST]: null,
        [StockSection.FAVORITES]: null
    });

    const displaySwitchViewButton = customViewportSize === 'twoColumns';

    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, section: StockSection) => {
        const target = e.currentTarget as HTMLButtonElement;
        const { width, left } = target.getBoundingClientRect();
        const { left: containerLeft } = target.parentElement?.getBoundingClientRect() as DOMRect;

        if (selectedSection === section) return;

        setSelectedSection(section);
        setBarWidth(barWidth + width);

        const sections = Object.values(StockSection);
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
