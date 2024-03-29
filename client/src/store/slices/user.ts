import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@/lib/localStorage.utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isOptional, isString } from '@thymecard/types';

export interface IUserDetails {
    id: string;
    firstName: string;
    email?: string;
    image?: string;
}

const isUserDetails = (val: any): val is IUserDetails => {
    return val && isString(val.id) && isString(val.firstName) && isOptional(val.email, isString) && isOptional(val.image, isString);
};

interface UserState {
    user: IUserDetails | null;
}

const storedUser = getLocalStorageItem<IUserDetails>('user', isUserDetails);

const initialState: UserState = {
    user: storedUser
};

export interface ILoginPayload {
    user: IUserDetails;
    sessionId: string;
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<ILoginPayload>) => {
            setLocalStorageItem('user', action.payload.user, isUserDetails);
            setLocalStorageItem('session', action.payload.sessionId, isString);

            state.user = action.payload.user;
        },
        logout: (state) => {
            removeLocalStorageItem('user');
            removeLocalStorageItem('session');

            state.user = null;
        }
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
