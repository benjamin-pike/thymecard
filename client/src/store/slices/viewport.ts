import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Breakpoint {
    name: string;
    min: number;
    max: number;
}

interface State {
    viewportSize: string;
    customViewportSize: string;
}

const defaultBreakpoints: Breakpoint[] = [
    { name: 'mobile', min: 0, max: 480 },
    { name: 'small', min: 481, max: 768 },
    { name: 'medium', min: 769, max: 1024 },
    { name: 'large', min: 1025, max: 1200 },
    { name: 'xlarge', min: 1201, max: 10000 }
];

const getInitialDefaultViewportSize = (breakpoints: Breakpoint[]): string => {
    const { innerWidth } = window;
    for (let i = 0; i < breakpoints.length; i++) {
        const min = breakpoints[i].min ?? 0;
        const max = breakpoints[i].max ?? Infinity;
        if (innerWidth >= min && innerWidth <= max) {
            return breakpoints[i].name;
        }
    }
    return 'xlarge';
};

const getInitialCustomViewportSize = (breakpoints: Breakpoint[]): string => {
    const { innerWidth } = window;
    for (let i = 0; i < breakpoints.length; i++) {
        const min = breakpoints[i].min ?? 0;
        const max = breakpoints[i].max ?? Infinity;
        if (innerWidth >= min && innerWidth <= max) {
            return breakpoints[i].name;
        }
    }
    return breakpoints[breakpoints.length - 1]?.name ?? '';
};

const initialState: State = {
    viewportSize: getInitialDefaultViewportSize(defaultBreakpoints),
    customViewportSize: getInitialCustomViewportSize([])
};

const viewportSlice = createSlice({
    name: 'viewport',
    initialState,
    reducers: {
        setViewportSize: (state, action: PayloadAction<string>) => {
            const newState = { ...state };
            newState.viewportSize = action.payload;
            
            return newState;
        },
        setCustomViewportSize: (state, action: PayloadAction<string>) => {
            const newState = { ...state };
            newState.customViewportSize = action.payload;
            
            return newState;
        }
    }
});

export const { setViewportSize, setCustomViewportSize } = viewportSlice.actions;

export default viewportSlice.reducer;
