import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validate } from '@thymecard/types';

type Theme = 'light' | 'dark';
const isTheme = (val: unknown): val is Theme => {
    const validThemes = ['light', 'dark'];
    return validThemes.includes(val as string);
};

const storedTheme = localStorage.getItem('theme');
const defaultTheme: Theme = validate(storedTheme, isTheme) ?? 'light';

const themeSlice = createSlice({
    name: 'theme',
    initialState: defaultTheme,
    reducers: {
        setTheme: (_state, action: PayloadAction<Theme>) => {
            localStorage.setItem('theme', action.payload);
            return action.payload;
        }
    }
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
