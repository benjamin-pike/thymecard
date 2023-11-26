import { createContext, useContext, FC, ReactElement, useReducer, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { IStock, IStockCategory, IStockItem, StockSection } from '@thymecard/types';
import { sendRequest } from '@/lib/api/sendRequest';
import { useMutation, useQuery } from '@tanstack/react-query';

interface IStockContext {
    stock: IStock;
    init: (stock: IStock) => void;
    createCategory: (section: StockSection) => () => void;
    removeCategory: (section: StockSection, categoryId: string) => () => void;
    updateCategoryName: (section: StockSection, category: IStockCategory) => (title: string) => void;
    addItem: (section: StockSection, category: IStockCategory) => () => void;
    updateItem: (
        section: StockSection,
        category: IStockCategory
    ) => (itemIndex: number, key: 'name' | 'quantity' | 'note', value: string) => void;
    removeItem: (section: StockSection, category: IStockCategory, itemId: string) => () => void;
    moveItem: (payload: IMoveItemPayload) => void;
    upsertStock: (section: StockSection, categories: IStockCategory[]) => Promise<void>;
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
    const [stock, dispatch] = useReducer(stockReducer, {
        _id: '',
        userId: '',
        pantry: [],
        shoppingList: [],
        favorites: []
    });

    useQuery<IStock>(
        ['stock'],
        async () => {
            const { status, data } = await sendRequest(`/api/stock`, 'GET');
            if (status !== 200) {
                throw new Error('Failed to fetch the recipe');
            }
            return data.stock;
        },
        {
            onSuccess: (data) => {
                if (data) {
                    console.log('data', data);
                    init(data);
                }
            }
        }
    );

    const upsertStockMutation = useMutation(async ({ section, categories }: { section: StockSection; categories: IStockCategory[] }) => {
        const { status, data } = await sendRequest('/api/stock', 'PUT', {
            body: {
                section,
                categories
            }
        });

        if (status !== 200 && status !== 201) {
            throw new Error('Failed to upsert recipe');
        }

        init({ ...stock, [data.section]: data.categories });
    });

    const upsertStock = useCallback(
        async (section: StockSection, categories: IStockCategory[]) => {
            await upsertStockMutation.mutateAsync({ section, categories });
        },
        [upsertStockMutation]
    );

    const init = useCallback((stock: IStock) => {
        dispatch({
            type: StockActions.INIT,
            payload: stock
        });
    }, []);

    const createCategory = useCallback(
        (section: StockSection) => () => {
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
        (section: StockSection, categoryId: string) => () => {
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
        (section: StockSection, category: IStockCategory) => (name: string) => {
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
        (section: StockSection, category: IStockCategory) => () => {
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
        (section: StockSection, category: IStockCategory) => (itemIndex: number, key: 'name' | 'quantity' | 'note', value: string) => {
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
        (section: StockSection, category: IStockCategory, itemId: string) => () => {
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

    const value = {
        stock,
        init,
        createCategory,
        removeCategory,
        updateCategoryName,
        addItem,
        updateItem,
        removeItem,
        moveItem,
        upsertStock
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
    section: StockSection;
    category: IStockCategory;
}

interface IRemoveCategoryPayload {
    section: StockSection;
    categoryId: string;
}

interface IMoveItemPayload {
    item: IStockItem;
    targetSection: StockSection;
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
    switch (action.type) {
        case StockActions.INIT:
            return action.payload;

        case StockActions.UPSERT_CATEGORY: {
            const { section, category } = action.payload;
            const index = state[section].findIndex((c) => c.id === category?.id);
            const newState = { ...state };

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

            if (index !== -1) {
                const newState = { ...state };
                newState[section].splice(index, 1);
                return newState;
            }

            return state;
        }

        case StockActions.MOVE_ITEM: {
            const { item, targetSection, targetCategoryId, newSection, removeFromOrigin } = action.payload;
            const newState = { ...state };

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
