import { createContext, useContext, FC, ReactElement, useReducer, useCallback, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { IStock, IStockCategory, IStockItem, EStockSection } from '@thymecard/types';
import { useStockAPI } from '@/api/useStockAPI';
import { useMount } from '@/hooks/common/useMount';
import { useDebounce } from '@/hooks/common/useDebounce';
import useLocalStorage from '@/hooks/common/useLocalStorage';

interface IStockContext {
    stock: IStock;
    selectedSection: EStockSection;
    init: (stock: IStock) => void;
    createCategory: (section: EStockSection) => () => void;
    removeCategory: (section: EStockSection, categoryId: string) => () => void;
    updateCategoryName: (section: EStockSection, category: IStockCategory) => (title: string) => void;
    addItem: (section: EStockSection, category: IStockCategory) => () => void;
    updateItem: (
        section: EStockSection,
        category: IStockCategory
    ) => (itemIndex: number, key: 'name' | 'quantity' | 'note', value: string) => void;
    removeItem: (section: EStockSection, category: IStockCategory, itemId: string) => () => void;
    moveItem: (payload: IMoveItemPayload) => void;
    handleSelectSection: (section: EStockSection) => void;
}

const StockContext = createContext<IStockContext | null>(null);
const { Provider } = StockContext;

export const useStock = () => {
    const context = useContext(StockContext);
    if (!context) {
        throw new Error('useStock must be used within a StockProvider');
    }
    return context;
};

interface IStockProviderProps {
    children: ReactElement;
}

const StockProvider: FC<IStockProviderProps> = ({ children }) => {
    const { getStock, upsertStock } = useStockAPI();

    const [stock, dispatch] = useReducer(stockReducer, {
        _id: '',
        userId: '',
        pantry: [],
        shoppingList: [],
        favorites: []
    });
    const [selectedSection, setSelectedSection] = useLocalStorage<EStockSection>('stock-tab', EStockSection.PANTRY);
    const selectedSectionRef = useRef(selectedSection);

    const handleSelectSection = useCallback(
        (section: EStockSection) => {
            setSelectedSection(section);
        },
        [setSelectedSection]
    );

    const handleUpsertStock = useCallback(
        async (stock: IStock, selectedSection: EStockSection) => {
            await upsertStock(selectedSection, stock[selectedSection]);
        },
        [upsertStock]
    );

    const debouncedUpsert = useDebounce(handleUpsertStock, 2000);

    const init = useCallback((stock: IStock) => {
        dispatch({
            type: StockActions.INIT,
            payload: stock
        });
    }, []);

    const createCategory = useCallback(
        (section: EStockSection) => () => {
            const newCategory: IStockCategory = {
                id: uuid(),
                name: '',
                items: []
            };

            dispatch({
                type: StockActions.UPSERT_CATEGORY,
                payload: {
                    section,
                    category: newCategory
                }
            });
        },
        []
    );

    const removeCategory = useCallback(
        (section: EStockSection, categoryId: string) => () => {
            dispatch({
                type: StockActions.REMOVE_CATEGORY,
                payload: {
                    section,
                    categoryId
                }
            });
        },
        []
    );

    const updateCategoryName = useCallback(
        (section: EStockSection, category: IStockCategory) => (name: string) => {
            dispatch({
                type: StockActions.UPSERT_CATEGORY,
                payload: {
                    section,
                    category: { ...category, name }
                }
            });
        },
        []
    );

    const addItem = useCallback(
        (section: EStockSection, category: IStockCategory) => () => {
            dispatch({
                type: StockActions.UPSERT_CATEGORY,
                payload: {
                    section,
                    category: {
                        ...category,
                        items: [...category.items, { id: uuid(), name: '', quantity: '', note: '' }]
                    }
                }
            });
        },
        []
    );

    const updateItem = useCallback(
        (section: EStockSection, category: IStockCategory) => (itemIndex: number, key: 'name' | 'quantity' | 'note', value: string) => {
            const newCategory = { ...category };
            newCategory.items[itemIndex][key] = value;

            dispatch({
                type: StockActions.UPSERT_CATEGORY,
                payload: {
                    section,
                    category: newCategory
                }
            });
        },
        []
    );

    const removeItem = useCallback(
        (section: EStockSection, category: IStockCategory, itemId: string) => () => {
            dispatch({
                type: StockActions.UPSERT_CATEGORY,
                payload: {
                    section,
                    category: { ...category, items: category.items.filter((item) => item.id !== itemId) }
                }
            });
        },
        []
    );

    const moveItem = useCallback((payload: IMoveItemPayload) => {
        dispatch({
            type: StockActions.MOVE_ITEM,
            payload
        });
    }, []);

    useMount(() => {
        const fetchDays = async () => {
            const stock = await getStock();

            init(stock);
        };

        fetchDays();
    });

    useEffect(() => {
        selectedSectionRef.current = selectedSection;
    }, [selectedSection]);

    useEffect(() => {
        debouncedUpsert(stock, selectedSectionRef.current);
    }, [debouncedUpsert, stock]);

    const value = {
        stock,
        selectedSection,
        init,
        createCategory,
        removeCategory,
        updateCategoryName,
        addItem,
        updateItem,
        removeItem,
        moveItem,
        handleSelectSection
    };

    return <Provider value={value}>{children}</Provider>;
};

export default StockProvider;

export enum StockActions {
    INIT = 'INIT',
    UPSERT_CATEGORY = 'UPSERT_CATEGORY',
    REMOVE_CATEGORY = 'REMOVE_CATEGORY',
    MOVE_ITEM = 'MOVE_ITEM'
}

interface IUpsertCategoryPayload {
    section: EStockSection;
    category: IStockCategory;
}

interface IRemoveCategoryPayload {
    section: EStockSection;
    categoryId: string;
}

interface IMoveItemPayload {
    item: IStockItem;
    targetSection: EStockSection;
    removeFromOrigin: boolean;
    targetCategoryId?: string;
    newSection?: string;
}

type Action =
    | { type: StockActions.INIT; payload: IStock }
    | { type: StockActions.UPSERT_CATEGORY; payload: IUpsertCategoryPayload }
    | { type: StockActions.REMOVE_CATEGORY; payload: IRemoveCategoryPayload }
    | { type: StockActions.MOVE_ITEM; payload: IMoveItemPayload };

const stockReducer = (state: IStock, action: Action): IStock => {
    const newState = { ...state };

    switch (action.type) {
        case StockActions.INIT:
            return action.payload;

        case StockActions.UPSERT_CATEGORY: {
            const { section, category } = action.payload;
            const index = state[section].findIndex((c) => c.id === category?.id);

            if (index === -1 && category) {
                newState[section].push(category);
            } else if (category) {
                newState[section][index] = category;
            }

            return newState;
        }

        case StockActions.REMOVE_CATEGORY: {
            const { section, categoryId } = action.payload;
            const index = state[section].findIndex((c) => c.id === categoryId);

            if (index === -1) {
                return newState;
            }

            newState[section].splice(index, 1);

            return newState;
        }

        case StockActions.MOVE_ITEM: {
            const { item, targetSection, targetCategoryId, newSection, removeFromOrigin } = action.payload;

            if (targetCategoryId) {
                const targetCategoryIndex = newState[targetSection].findIndex((c) => c.id === targetCategoryId);

                if (targetCategoryIndex !== -1) {
                    newState[targetSection][targetCategoryIndex].items.push(item);
                }
            } else if (newSection) {
                const newCategory: IStockCategory = {
                    id: uuid(),
                    name: newSection,
                    items: [item]
                };

                newState[targetSection].push(newCategory);
            }

            if (removeFromOrigin) {
                newState[targetSection].forEach((c) => {
                    const index = c.items.findIndex((i) => i.id === item.id);

                    if (index !== -1) {
                        c.items.splice(index, 1);
                    }
                });
            }

            return newState;
        }

        default:
            return state;
    }
};
