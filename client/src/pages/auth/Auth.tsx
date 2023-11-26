import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useUser from '@/hooks/user/useUser';
import { sendRequest } from '@/lib/api/sendRequest';
import { setLocalStorageItem } from '@/lib/localStorage.utils';
import { isString } from '@thymecard/types';
import { createToast } from '@/lib/toast/toast.utils';
import styles from './auth.module.scss';

const Auth = () => {
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useMutation(() => sendRequest('/api/auth/login', 'POST', { body: { email, password } }));

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleLogin = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            loginMutation.mutate(undefined, {
                onSuccess: (data) => {
                    const { user, tokens } = data.data;

                    loginUser({
                        user: {
                            id: user._id,
                            firstName: user.firstName,
                            email: user.email
                        },
                        tokens
                    });

                    setLocalStorageItem('accessToken', tokens.accessToken, isString);
                    setLocalStorageItem('refreshToken', tokens.refreshToken, isString);

                    navigate('/dashboard');
                },
                onError: () => {
                    createToast('error', 'Invalid email or password');
                }
            });
        },
        [loginUser, loginMutation, navigate]
    );

    return (
        <main className={styles.auth}>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Email" value={email} onChange={handleEmailChange} />
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                <button type="submit">Login</button>
            </form>
        </main>
    );
};

export default Auth;
