import { configureStore, combineReducers } from '@reduxjs/toolkit';
import viewportReducer from './slices/viewport';
import themeReducer from './slices/theme';
import userReducer from './slices/user';

export const rootReducer = combineReducers({
    viewport: viewportReducer,
    theme: themeReducer,
    user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer
});
