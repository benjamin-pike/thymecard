import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { useToggle } from '@mantine/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import Event from './Event';
import Tooltip from '@/components/common/tooltip/Tooltip';
import ScrollWrapper from '@/components/wrappers/scroll/ScrollWrapper';
import ModalWrapper from '@/components/wrappers/modal/ModalWrapper';

import { EventType } from '@thymecard/types';
import { ICONS } from '@/assets/icons';

import styles from './plan.module.scss';

const AddIcon = ICONS.common.plus;
const CopyIcon = ICONS.common.copy;
const ClearIcon = ICONS.common.delete;

const StockIcon = ICONS.recipes.tickList;

const TODAY = DateTime.now();
const DAYS = [
    [
        {
            type: EventType.BREAKFAST,
            time: DateTime.fromObject({ hour: 9, minute: 30 }),
            duration: 45,
            calories: 536,
            items: [
                {
                    title: 'Eggs Benedict with Salmon and Avocado',
                    isFavorite: false
                },
                { title: 'Orange Juice', isFavorite: false },
                { title: 'Banana', isFavorite: true }
            ]
        },
        {
            type: EventType.LUNCH,
            time: DateTime.fromObject({ hour: 13, minute: 30 }),
            duration: 35,
            calories: 724,
            items: [
                {
                    title: 'Bacon, Lettuce, and Tomato Bagel',
                    isFavorite: true
                },
                {
                    title: 'Lightly Salted Crisps',
                    isFavorite: false
                },
                {
                    title: 'Kale, Apple, and Kiwi Super Smoothie',
                    isFavorite: true
                }
            ]
        },
        {
            type: EventType.SNACK,
            time: DateTime.fromObject({ hour: 16, minute: 15 }),
            duration: 5,
            calories: 156,
            items: [{ title: 'Banana', isFavorite: false }]
        },
        {
            type: EventType.DRINK,
            time: DateTime.fromObject({ hour: 19, minute: 10 }),
            duration: 10,
            calories: 142,
            items: [{ title: 'Glass of Red Wine', isFavorite: true }]
        },
        {
            type: EventType.DINNER,
            time: DateTime.fromObject({ hour: 19, minute: 30 }),
            duration: 90,
            calories: 951,
            items: [
                { title: 'Roast Pork Belly', isFavorite: true, recipeId: '652d8578653db11bb49ffadc' },
                {
                    title: 'Potatoes Au Gratin',
                    isFavorite: false,
                    recipeId: '652d8422653db11bb49ffacf'
                },
                {
                    title: 'Sauted Sweetheart Cabbage',
                    isFavorite: false
                },
                {
                    title: 'Apple and Onion Gravy',
                    isFavorite: true
                }
            ]
        }
    ],
    [
        {
            type: EventType.BREAKFAST,
            time: DateTime.fromObject({ hour: 8, minute: 45 }),
            duration: 40,
            calories: 480,
            items: [
                {
                    title: 'Greek Yogurt with Honey and Berries',
                    isFavorite: true
                },
                { title: 'Whole Grain Toast', isFavorite: false },
                { title: 'Strawberry Smoothie', isFavorite: true }
            ]
        },
        {
            type: EventType.LUNCH,
            time: DateTime.fromObject({ hour: 12, minute: 45 }),
            duration: 30,
            calories: 650,
            items: [
                {
                    title: 'Quinoa Salad with Grilled Chicken',
                    isFavorite: true
                },
                { title: 'Cherry Tomatoes', isFavorite: false },
                { title: 'Almond Snack Bar', isFavorite: true }
            ]
        },
        {
            type: EventType.SNACK,
            time: DateTime.fromObject({ hour: 15, minute: 30 }),
            duration: 10,
            calories: 120,
            items: [{ title: 'Mixed Nuts', isFavorite: true }]
        },
        {
            type: EventType.DRINK,
            time: DateTime.fromObject({ hour: 18, minute: 0 }),
            duration: 5,
            calories: 50,
            items: [{ title: 'Green Tea', isFavorite: true }]
        },
        {
            type: EventType.DINNER,
            time: DateTime.fromObject({ hour: 20, minute: 0 }),
            duration: 175,
            calories: 2800,
            items: [
                {
                    title: 'Salmon with Lemon-Dill Sauce',
                    isFavorite: true
                },
                {
                    title: 'Roasted Sweet Potatoes',
                    isFavorite: false
                },
                { title: 'Steamed Asparagus', isFavorite: true }
            ]
        }
    ],
    [
        {
            type: EventType.BREAKFAST,
            time: DateTime.fromObject({ hour: 8, minute: 0 }),
            duration: 45,
            calories: 550,
            items: [
                {
                    title: 'Oatmeal with Berries and Nuts',
                    isFavorite: true
                },
                {
                    title: 'Greek Yogurt Parfait',
                    isFavorite: false
                },
                { title: 'Orange Juice', isFavorite: true }
            ]
        },
        {
            type: EventType.LUNCH,
            time: DateTime.fromObject({ hour: 13, minute: 0 }),
            duration: 40,
            calories: 700,
            items: [
                {
                    title: 'Grilled Chicken Caesar Salad',
                    isFavorite: true
                },
                {
                    title: 'Garlic Breadsticks',
                    isFavorite: false
                },
                { title: 'Iced Tea', isFavorite: true }
            ]
        },
        {
            type: EventType.SNACK,
            time: DateTime.fromObject({ hour: 16, minute: 0 }),
            duration: 15,
            calories: 180,
            items: [
                {
                    title: 'Hummus with Carrot Sticks',
                    isFavorite: true
                }
            ]
        },
        {
            type: EventType.APPETIZER,
            time: DateTime.fromObject({ hour: 18, minute: 30 }),
            duration: 20,
            calories: 250,
            items: [
                {
                    title: 'Spinach and Artichoke Dip',
                    isFavorite: true
                },
                { title: 'Crackers', isFavorite: false }
            ]
        },
        {
            type: EventType.DINNER,
            time: DateTime.fromObject({ hour: 19, minute: 30 }),
            duration: 90,
            calories: 900,
            items: [
                {
                    title: 'Vegetarian Stir-Fry with Tofu',
                    isFavorite: true
                },
                { title: 'Brown Rice', isFavorite: false },
                { title: 'Mango Sorbet', isFavorite: true }
            ]
        },
        {
            type: EventType.DESSERT,
            time: DateTime.fromObject({ hour: 20, minute: 0 }),
            duration: 30,
            calories: 400,
            items: [
                { title: 'Chocolate Mousse', isFavorite: true },
                { title: 'Fresh Strawberries', isFavorite: false }
            ]
        }
    ],
    [
        {
            type: EventType.BREAKFAST,
            time: DateTime.fromObject({ hour: 7, minute: 30 }),
            duration: 40,
            calories: 480,
            items: [
                {
                    title: 'Smoothie Bowl with Mixed Berries',
                    isFavorite: true
                },
                {
                    title: 'Whole Grain Toast with Avocado',
                    isFavorite: false
                },
                { title: 'Black Coffee', isFavorite: true }
            ]
        },
        {
            type: EventType.LUNCH,
            time: DateTime.fromObject({ hour: 12, minute: 0 }),
            duration: 45,
            calories: 750,
            items: [
                {
                    title: 'Turkey and Swiss Sandwich',
                    isFavorite: true
                },
                {
                    title: 'Sweet Potato Fries',
                    isFavorite: false
                },
                { title: 'Iced Lemonade', isFavorite: true }
            ]
        },
        {
            type: EventType.SNACK,
            time: DateTime.fromObject({ hour: 15, minute: 0 }),
            duration: 10,
            calories: 120,
            items: [
                {
                    title: 'Greek Yogurt with Honey',
                    isFavorite: true
                }
            ]
        },
        {
            type: EventType.APPETIZER,
            time: DateTime.fromObject({ hour: 18, minute: 0 }),
            duration: 25,
            calories: 300,
            items: [
                {
                    title: 'Caprese Salad Skewers',
                    isFavorite: true
                },
                { title: 'Balsamic Glaze', isFavorite: false }
            ]
        },
        {
            type: EventType.DINNER,
            time: DateTime.fromObject({ hour: 19, minute: 30 }),
            duration: 80,
            calories: 900,
            items: [
                {
                    title: 'Grilled Salmon with Lemon Dill Sauce',
                    isFavorite: true
                },
                { title: 'Quinoa Pilaf', isFavorite: false },
                {
                    title: 'Roasted Brussels Sprouts',
                    isFavorite: true
                }
            ]
        },
        {
            type: EventType.DESSERT,
            time: DateTime.fromObject({ hour: 21, minute: 0 }),
            duration: 30,
            calories: 450,
            items: [
                { title: 'Mango Sorbet', isFavorite: true },
                {
                    title: 'Dark Chocolate Square',
                    isFavorite: false
                }
            ]
        }
    ],
    [
        {
            type: EventType.BREAKFAST,
            time: DateTime.fromObject({ hour: 8, minute: 0 }),
            duration: 40,
            calories: 500,
            items: [
                {
                    title: 'Avocado Toast with Poached Eggs',
                    isFavorite: true
                },
                { title: 'Fresh Fruit Salad', isFavorite: false },
                { title: 'Green Tea', isFavorite: true }
            ]
        },
        {
            type: EventType.LUNCH,
            time: DateTime.fromObject({ hour: 13, minute: 0 }),
            duration: 45,
            calories: 700,
            items: [
                {
                    title: 'Quinoa and Black Bean Bowl',
                    isFavorite: true
                },
                {
                    title: 'Cilantro-Lime Dressing',
                    isFavorite: false
                },
                { title: 'Iced Hibiscus Tea', isFavorite: true }
            ]
        },
        {
            type: EventType.SNACK,
            time: DateTime.fromObject({ hour: 15, minute: 30 }),
            duration: 15,
            calories: 180,
            items: [
                {
                    title: 'Mixed Berries with Greek Yogurt',
                    isFavorite: true
                }
            ]
        },
        {
            type: EventType.DINNER,
            time: DateTime.fromObject({ hour: 18, minute: 30 }),
            duration: 90,
            calories: 950,
            items: [
                {
                    title: 'Pasta Primavera with Pesto Sauce',
                    isFavorite: true
                },
                { title: 'Garlic Bread', isFavorite: false },
                {
                    title: 'Sparkling Water with Lemon',
                    isFavorite: true
                }
            ]
        },
        {
            type: EventType.DESSERT,
            time: DateTime.fromObject({ hour: 20, minute: 0 }),
            duration: 30,
            calories: 400,
            items: [
                {
                    title: 'Strawberry Cheesecake',
                    isFavorite: true
                },
                { title: 'Whipped Cream', isFavorite: false }
            ]
        }
    ]
];

interface IPlanProps {
    handleSelectRecipe: (recipeId: string) => void;
    handleToggleVisibleInfo: () => void;
}

const Plan: FC<IPlanProps> = ({ handleSelectRecipe, handleToggleVisibleInfo }) => {
    const { customViewportSize } = useSelector((state: RootState) => state.viewport);

    const bodyRef = useRef<HTMLDivElement>(null);
    const [selectedDay, setSelectedDay] = useState(0);
    const selectedDayDate = TODAY.plus({ days: selectedDay });

    const [isAddEventModalOpen, toggleAddEventModal] = useToggle([false, true]);

    const displaySwitchViewButton = customViewportSize === 'twoColumns';

    const handleToggleAddEventModalVisibility = useCallback(() => {
        toggleAddEventModal();
    }, [toggleAddEventModal]);

    const handleSelectDay = useCallback(
        (day: number) => () => {
            setSelectedDay(day);
        },
        []
    );

    useEffect(() => {
        if (!bodyRef.current) {
            return;
        }

        const scrollWrapperElement = bodyRef.current?.parentElement;
        const eventElements = Array.from(bodyRef.current.children) as HTMLDivElement[];

        if (!scrollWrapperElement) {
            return;
        }

        let hasScrolled = false;
        for (const eventElement of eventElements) {
            if (eventElement.attributes.getNamedItem('data-past')?.value === 'true') {
                scrollWrapperElement.scrollTo({ top: eventElement.offsetTop + eventElement.offsetHeight, behavior: 'smooth' });
                hasScrolled = true;
            } else {
                if (hasScrolled) {
                    return;
                }
                break;
            }
        }

        scrollWrapperElement.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedDay, bodyRef]);

    return (
        <>
            <section className={styles.plan}>
                <div className={styles.selectedDay}>
                    <header className={styles.top}>
                        <p className={styles.date}>
                            <span className={styles.dateDay}>{selectedDayDate.toFormat('cccc')}</span>
                            <span>{selectedDayDate.toFormat('d')}</span>
                            <span className={styles.dateMonth}>{selectedDayDate.toFormat('MMMM')}</span>
                        </p>
                        <div className={styles.buttons}>
                            <button className={styles.addEvent} onClick={handleToggleAddEventModalVisibility}>
                                <AddIcon />
                                <p>Add Event</p>
                            </button>
                            <button className={styles.copyDay}>
                                <CopyIcon />
                                <p>Copy Day</p>
                            </button>
                            <button className={styles.clearDay}>
                                <ClearIcon />
                                <p>Clear Day</p>
                            </button>
                        </div>
                        {displaySwitchViewButton && (
                            <button className={styles.switchView} onClick={handleToggleVisibleInfo}>
                                <StockIcon />
                            </button>
                        )}
                    </header>
                    <div className={styles.scrollContainer}>
                        <ScrollWrapper height={'100%'} padding={1.25}>
                            <div ref={bodyRef} className={styles.body}>
                                {DAYS[selectedDay].map((event, i) => (
                                    <Event key={i} {...event} isToday={selectedDay === 0} handleSelectRecipe={handleSelectRecipe} />
                                ))}
                                <Tooltip id="favorite-meal-item" place="bottom" offset={10} size="small" />
                                <Tooltip id="link-to-recipe" place="bottom" offset={10} size="small" />
                                <Tooltip id="edit-meal-item" place="bottom" offset={10} size="small" />
                                <Tooltip id="remove-meal-item" place="bottom" offset={10} size="small" />
                            </div>
                        </ScrollWrapper>
                    </div>
                </div>
                <ul className={styles.days}>
                    {DAYS.map((events, i) => (
                        <li key={i} className={styles.day} data-selected={selectedDay === i}>
                            <button onClick={handleSelectDay(i)}>
                                <p>
                                    <span>{TODAY.plus({ days: i }).toFormat('ccc')[0]}</span>
                                    <span className={styles.dividerText}>{'   |   '}</span>
                                    <span>{TODAY.plus({ days: i }).toFormat('d')}</span>
                                </p>
                                <ul className={styles.events}>
                                    {events.map(({ type, items }, i) => (
                                        <li key={i} className={styles.event} data-event={type} data-items={items} />
                                    ))}
                                </ul>
                            </button>
                        </li>
                    ))}
                    <div className={styles.bar} data-day={selectedDay} />
                </ul>
            </section>
            <AddEventModal isOpen={isAddEventModalOpen} closeModal={handleToggleAddEventModalVisibility} />
        </>
    );
};

interface IAddEventModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const AddEventModal: FC<IAddEventModalProps> = ({ isOpen, closeModal }) => {
    return (
        <ModalWrapper isOpen={isOpen} closeModal={closeModal} blurBackground={false}>
            <h1>Add Event</h1>
        </ModalWrapper>
    );
};

export default Plan;
