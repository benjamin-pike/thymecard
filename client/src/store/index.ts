import { configureStore, combineReducers } from '@reduxjs/toolkit';
import viewportReducer from './slices/viewport';
import themeReducer from './slices/theme';
import stockReducer from './slices/stock';

export const rootReducer = combineReducers({
    viewport: viewportReducer,
    theme: themeReducer,
    stock: stockReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer
});
