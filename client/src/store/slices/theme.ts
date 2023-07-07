import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';
const defaultTheme: Theme = localStorage.getItem('theme') as Theme || 'light';

const themeSlice = createSlice({
    name: 'theme',
    initialState: defaultTheme,
    reducers: {
        setTheme: (_state, action: PayloadAction<Theme>) => {
            localStorage.setItem('theme', action.payload);
            return action.payload;
        },
    },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;