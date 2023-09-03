import { FC, useEffect, useRef, useState } from 'react';
import styles from './header.module.scss';
import { capitalize } from '@/lib/string.utils';
import { ICONS } from '@/assets/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const FridgeIcon = ICONS.recipes.fridge;
const ShoppingListIcon = ICONS.recipes.shoppingList;
const StarIcon = ICONS.common.star;
const EllipsisIcon = ICONS.common.ellipsis;
const SearchIcon = ICONS.common.search;

const TABS = [
    {
        name: 'pantry',
        icon: <FridgeIcon />
    },
    {
        name: 'shopping list',
        icon: <ShoppingListIcon />
    },
    {
        name: 'favorites',
        icon: <StarIcon />
    }
];

interface IHeaderProps {
    selectedTab: number;
    setSelectedTab: (tab: number) => void;
    handleToggleVisibleInfo: () => void;
}

const Header: FC<IHeaderProps> = ({ selectedTab, setSelectedTab, handleToggleVisibleInfo }) => {
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);

    const [barWidth, setBarWidth] = useState(0);
    const [barMarginLeft, setBarMarginLeft] = useState(0);
    const [isInitialRender, setIsInitialRender] = useState(true);

    const tabRefs = [...Array(TABS.length)].map(() => useRef<HTMLButtonElement>(null));
    const barRef = useRef<HTMLDivElement>(null);

    const displaySwitchViewButton = customViewportSize === 'listPlus';

    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, i: number) => {
        const target = e.currentTarget as HTMLButtonElement;
        const { width, left } = target.getBoundingClientRect();
        const { left: containerLeft } = target.parentElement?.getBoundingClientRect() as DOMRect;

        if (selectedTab === i) return;

        setSelectedTab(i);

        setBarWidth(barWidth + width);

        if (i < selectedTab) {
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
    }, [selectedTab]);

    useEffect(() => {
        const target = tabRefs[selectedTab].current;
        if (!target) return;
        const { width, left } = target.getBoundingClientRect();
        const { left: containerLeft } = target.parentElement?.getBoundingClientRect() as DOMRect;

        setBarWidth(width);
        setBarMarginLeft(left - containerLeft);

        setIsInitialRender(false);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.tabs}>
                {TABS.map((tab, i) => (
                    <button key={tab.name} ref={tabRefs[i]} data-name={tab.name} onClick={(e) => handleTabClick(e, i)}>
                        {tab.icon}
                        <span>{capitalize(tab.name)}</span>
                    </button>
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
                <button>
                    <EllipsisIcon />
                </button>
                {displaySwitchViewButton && (
                    <button className={styles.switchView} onClick={handleToggleVisibleInfo}>
                        <SearchIcon />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
