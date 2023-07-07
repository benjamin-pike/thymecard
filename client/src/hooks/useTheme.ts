import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/store/slices/theme';
import { RootState } from '@/store';

export const useTheme = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
    };

    return { theme, toggleTheme };
};
