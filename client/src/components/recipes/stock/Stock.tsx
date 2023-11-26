import { FC } from 'react';
import { useSelector } from 'react-redux';
import useLocalStorage from '@/hooks/common/useLocalStorage';
import Header from './header/Header';
import Category from './category/Category';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { RootState } from '@/store';
import { StockSection } from '@thymecard/types';
import { useStock } from './StockProvider';
import styles from './stock.module.scss';

interface IStockProps {
    handleToggleVisibleInfo: () => void;
}

const Stock: FC<IStockProps> = ({ handleToggleVisibleInfo }) => {
    const { stock, createCategory, upsertStock } = useStock();
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);

    const [selectedSection, setSelectedSection] = useLocalStorage<StockSection>('stock-tab', StockSection.PANTRY);
    const categories = stock[selectedSection];

    const handleBlur = (e: React.FocusEvent<HTMLUListElement>) => {
        const currentTarget = e.currentTarget;
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                console.log('blur');
                upsertStock(selectedSection, categories);
            }
        }, 0);
    };

    return (
        <section className={styles.stock}>
            <Header
                key={customViewportSize}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                handleToggleVisibleInfo={handleToggleVisibleInfo}
            />
            <div className={styles.scrollContainer}>
                <ScrollWrapper key={selectedSection} height={'100%'} padding={1.25}>
                    <ul className={styles.body} onBlur={handleBlur}>
                        {categories.map((category) => {
                            return <Category key={category.id} section={selectedSection} category={category} />;
                        })}
                        <button className={styles.addCategory} onClick={createCategory(selectedSection)}>
                            <span>Add Category</span>
                        </button>
                    </ul>
                </ScrollWrapper>
            </div>
        </section>
    );
};

export default Stock;
