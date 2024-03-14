import { FC } from 'react';
import { useSelector } from 'react-redux';
import Header from './header/Header';
import Category from './category/Category';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { RootState } from '@/store';
import { useStock } from './StockProvider';
import styles from './stock.module.scss';
import LoadingDots from '@/components/common/loading-dots/LoadingDots';

interface IStockProps {
    handleToggleVisibleInfo: () => void;
}

const Stock: FC<IStockProps> = ({ handleToggleVisibleInfo }) => {
    const { stock, isLoading, selectedSection, createCategory } = useStock();
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);

    const categories = stock[selectedSection];

    return (
        <section className={styles.stock}>
            <Header key={customViewportSize} handleToggleVisibleInfo={handleToggleVisibleInfo} />
            <div className={styles.scrollContainer}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <LoadingDots />
                    </div>
                ) : (
                    <ScrollWrapper key={selectedSection} height={'100%'} padding={1.25}>
                        <ul className={styles.body}>
                            {categories.map((category) => {
                                return <Category key={category.id} section={selectedSection} category={category} />;
                            })}
                            <button className={styles.addCategory} onClick={createCategory(selectedSection)}>
                                <span>Add Category</span>
                            </button>
                        </ul>
                    </ScrollWrapper>
                )}
            </div>
        </section>
    );
};

export default Stock;
