import { FC } from 'react';
import { useSelector } from 'react-redux';
import Header from './header/Header';
import Category from './category/Category';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import { RootState } from '@/store';
import { useStock } from './StockProvider';
import styles from './stock.module.scss';

interface IStockProps {
    handleToggleVisibleInfo: () => void;
}

const Stock: FC<IStockProps> = ({ handleToggleVisibleInfo }) => {
    const { stock, selectedSection, createCategory } = useStock();
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);

    const categories = stock[selectedSection];

    // const handleBlur = (e: React.FocusEvent<HTMLUListElement>) => {
    //     const currentTarget = e.currentTarget;
    //     setTimeout(() => {
    //         if (!currentTarget.contains(document.activeElement)) {
    //             console.log('blur');
    //             handleUpsertStock(selectedSection);
    //         }
    //     }, 0);
    // };

    return (
        <section className={styles.stock}>
            <Header key={customViewportSize} handleToggleVisibleInfo={handleToggleVisibleInfo} />
            <div className={styles.scrollContainer}>
                <ScrollWrapper key={selectedSection} height={'100%'} padding={1.25}>
                    <ul className={styles.body}>
                        {/* onBlur={handleBlur}> */}
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
