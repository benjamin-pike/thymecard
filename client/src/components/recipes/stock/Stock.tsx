import { v4 as uuidv4 } from 'uuid';
import { FC, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { upsertCategory } from '@/store/slices/stock';
import useLocalStorage from '@/hooks/useLocalStorage';
import Header from './header/Header';
import Category from './category/Category';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { ICONS } from '@/assets/icons';
import { RootState } from '@/store';
import { stockTabs } from '@/types/recipe.types';
import styles from './stock.module.scss';

const PlusIcon = ICONS.common.plus;

interface IStockProps {
    handleToggleVisibleInfo: () => void;
}

const Stock: FC<IStockProps> = ({ handleToggleVisibleInfo }) => {
    const dispatch = useDispatch();
    
    const data = useSelector((state: RootState) => state.stock);
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);
    
    const [selectedTab, setSelectedTab] = useLocalStorage('stock-tab', 0);
    const selectedTabName = stockTabs[selectedTab];
    const selectedData = data[selectedTabName];

    const createCategory = useCallback(() => {
        const newCategory = { id: uuidv4(), name: '', items: [] };

        dispatch(upsertCategory({ tab: selectedTabName, category: newCategory }));
    }, [selectedTabName]);

    return (
        <section className={styles.stock}>
            <Header key={customViewportSize} selectedTab={selectedTab} setSelectedTab={setSelectedTab} handleToggleVisibleInfo={handleToggleVisibleInfo}/>
            <div className={styles.divider} />
            <div className={styles.scrollContainer}>
                <ScrollWrapper key={selectedTabName} height={'100%'} padding={1.25}>
                    <ul className={styles.body}>
                        {selectedData.map((category, index) => {
                            return (
                                <Category
                                    key={JSON.stringify(category) + index}
                                    tab={selectedTabName}
                                    category={category}
                                    data={data}
                                />
                            );
                        })}
                        <button className={styles.addCategory} onClick={createCategory}>
                            <span>
                                <PlusIcon /> Add category
                            </span>
                        </button>
                    </ul>
                </ScrollWrapper>
            </div>
        </section>
    );
};

export default Stock;
