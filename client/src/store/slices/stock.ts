import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isStockData, IStockCategory, IStockItem, StockTab } from '@/types/recipe.types';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage.utils';

interface IUpsertPayload {
    tab: StockTab;
    category: IStockCategory;
}

interface IRemovePayload {
    tab: StockTab;
    categoryId: string;
}

interface IMoveItemPayload {
    item: IStockItem;
    targetTab: StockTab;
    targetCategoryId?: string;
    newCategoryName?: string;
    removeFromOrigin?: boolean;
}

export type Data = Record<StockTab, IStockCategory[]>;

const storedData: Data | null = getLocalStorageItem('stock-data', isStockData);

const defaultData: Data = {
    pantry: [{ id: uuidv4(), name: '', items: [] }],
    'shopping-list': [{ id: uuidv4(), name: '', items: [] }],
    favorites: [{ id: uuidv4(), name: '', items: [] }]
};

const stockSlice = createSlice({
    name: 'stockData',
    initialState: storedData ? storedData : defaultData,
    reducers: {
        upsertCategory: (state, action: PayloadAction<IUpsertPayload>) => {
            const { tab, category } = action.payload;
            const index = state[tab].findIndex((c) => c.id === category.id);

            if (index === -1) {
                state[tab].push(category);
            } else {
                state[tab][index] = category;
            }

            setLocalStorageItem('stock-data', state, isStockData);

            return state;
        },
        removeCategory: (state, action: PayloadAction<IRemovePayload>) => {
            const { tab, categoryId } = action.payload;
            const index = state[tab].findIndex((c) => c.id === categoryId);

            if (index === -1) {
                return state;
            }

            state[tab].splice(index, 1);

            setLocalStorageItem('stock-data', state, isStockData);

            return state;
        },
        moveItem: (state, action: PayloadAction<IMoveItemPayload>) => {
            const { item, targetTab, targetCategoryId, newCategoryName, removeFromOrigin } = action.payload;

            if (targetCategoryId) {
                const targetCategoryIndex = state[targetTab].findIndex((c) => c.id === targetCategoryId);

                if (targetCategoryIndex === -1) {
                    return state;
                }

                state[targetTab][targetCategoryIndex].items.push(item);
            } else if (newCategoryName) {
                const newCategory: IStockCategory = {
                    id: uuidv4(),
                    name: newCategoryName,
                    items: [item]
                };

                state[targetTab].push(newCategory);
            }

            if (removeFromOrigin) {
                state[targetTab].forEach((c) => {
                    const index = c.items.findIndex((i) => i.id === item.id);

                    if (index !== -1) {
                        c.items.splice(index, 1);
                    }
                });
            };

            setLocalStorageItem('stock-data', state, isStockData);

            return state;
        }
    }
});

export const { upsertCategory, removeCategory, moveItem } = stockSlice.actions;

export default stockSlice.reducer;
