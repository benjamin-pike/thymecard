import { FC, ReactElement, useState } from 'react';
import { formatClasses } from '@/lib/common.utils';
import { BsChevronDown } from 'react-icons/bs';
import styles from './accordion.module.scss';

interface AccordionData {
    name: string;
    title: string;
    values: { primary: string; sup?: string }[];
    body: ReactElement;
}

interface AccordionItemProps extends AccordionData {
    isActive: boolean;
    handleClick: () => void;
}

interface IAccordionProps {
    data: AccordionData[];
}

const Accordion: FC<IAccordionProps> = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <div className={styles.accordion}>
            {data.map((item, index, arr) => (
                <>
                    <AccordionItem
                        key={index}
                        name={item.name}
                        title={item.title}
                        values={item.values}
                        body={item.body}
                        isActive={index === activeIndex}
                        handleClick={() => handleClick(index)}
                    />
                    {index !== arr.length - 1 && <div className={styles.divider} />}
                </>
            ))}
        </div>
    );
};

export default Accordion;

const AccordionItem: React.FC<AccordionItemProps> = ({ name, title, values, body, isActive, handleClick }) => (
    <div className={formatClasses(styles, ['row', name])} data-active={isActive}>
        <div className={styles.title} onClick={handleClick}>
            <h5>{title.toUpperCase()}</h5>
            {values.map((val) => (
                <p className={styles.value}>
                    {val.primary}
                    {val.sup && <span> • {val.sup}</span>}
                </p>
            ))}
            <button>
                <BsChevronDown />
            </button>
        </div>
        <div className={styles.wrapper}>
            <div className={styles.body}>{body}</div>
        </div>
    </div>
);
