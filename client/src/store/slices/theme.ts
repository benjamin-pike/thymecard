import jwt_decode from 'jwt-decode';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validateWithNull } from '@/lib/type.utils';

export const getIsPremium = () => {
  const accessToken = localStorage.getItem('accessToken');
  const decodedToken = accessToken ? jwt_decode(accessToken) as any : null;
  return decodedToken?.claims?.premium ?? false;
};

type Theme = 'light' | 'dark';
const isTheme = (val: unknown): val is Theme => {
    const validThemes = ['light', 'dark'];
    return validThemes.includes(val as string);
};

const isPremium = getIsPremium();
const storedTheme = isPremium ? localStorage.getItem('theme') : null
const defaultTheme: Theme = validateWithNull(storedTheme, isTheme) ?? 'light';

const themeSlice = createSlice({
    name: 'theme',
    initialState: defaultTheme,
    reducers: {
        setTheme: (_state, action: PayloadAction<Theme>) => {
            if (!isPremium) return defaultTheme;

            localStorage.setItem('theme', action.payload);
            return action.payload;
        },
    },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;