import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ILoginPayload, IUserDetails } from '@/store/slices/user';
import { login, logout } from '@/store/slices/user';
import { getUserImageUrl } from '@/lib/s3/s3.utils';

interface IBaseLoginPayload extends Omit<ILoginPayload, 'user'> {
    user: Omit<ILoginPayload['user'], 'image'>;
}

const useUser = (isAuthenticated = false) => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.user);

    const loginUser = (payload: IBaseLoginPayload) => {
        const user: ILoginPayload['user'] = {
            ...payload.user,
            image: getUserImageUrl(payload.user.id)
        };

        dispatch(login({ ...payload, user }));
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    const user = userState.user;
    if (isAuthenticated && !user) {
        throw new Error('User is not defined');
    }

    return {
        user: user as IUserDetails,
        loginUser,
        logoutUser
    };
};

export default useUser;
