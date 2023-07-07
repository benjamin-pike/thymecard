import { configureStore, combineReducers } from '@reduxjs/toolkit';

import viewportReducer from './slices/viewport';
import themeReducer from './slices/theme';

export const rootReducer = combineReducers({
    viewport: viewportReducer,
    theme: themeReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer
});
