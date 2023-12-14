import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useUser from '@/hooks/user/useUser';

import AuthSection from './common/AuthSection';
import Welcome from './stages/login/Welcome';
import Password from './stages/login/Password';

import { formatError, sendRequest } from '@/lib/api/sendRequest';
import { createToast } from '@/lib/toast/toast.utils';
import { ErrorCode, isValidEmail } from '@thymecard/types';
import { buildUrl, standardizeErrorCode } from '@thymecard/utils';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();

    const [stage, setStage] = useState<number>(1);
    const [currentTransition, setCurrentTransition] = useState<[number, number] | undefined>();

    const loginMutation = useMutation(() => sendRequest('/api/auth/session', 'POST', { body: { email, password } }));

    const handleEmailChange = useCallback((value: string) => {
        setEmail(value);
    }, []);

    const handlePasswordChange = useCallback((value: string) => {
        setPassword(value);
    }, []);

    const handleContinue = useCallback(() => {
        if (!isValidEmail(email)) {
            createToast('error', 'Invalid email address');
            return;
        }

        setCurrentTransition([stage, stage + 1]);

        setTimeout(() => {
            setStage(2);
        }, 300);

        setTimeout(() => {
            setCurrentTransition(undefined);
        }, 600);
    }, [email, stage]);

    const handleReverse = useCallback(() => {
        setPassword(undefined);
        setCurrentTransition([stage, stage - 1]);

        setTimeout(() => {
            setStage(1);
        }, 300);

        setTimeout(() => {
            setCurrentTransition(undefined);
        }, 600);
    }, [stage]);

    const handleLogin = useCallback(() => {
        loginMutation.mutate(undefined, {
            onSuccess: (data) => {
                const { user, session } = data.data;

                loginUser({
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        email: user.email,
                        image: user.image
                    },
                    sessionId: session._id
                });

                navigate('/dashboard');
            },
            onError: (err: any) => {
                const formattedError = formatError(err);

                if (formattedError.code === standardizeErrorCode(ErrorCode.IncompleteRegistration)) {
                    console.log('incomplete registration');
                    const url = buildUrl('/register/partial', { query: { credentialId: formattedError.data.credentialId } });
                    console.log(url);
                    return navigate(url);
                }

                createToast('error', formattedError.message);
            }
        });
    }, [loginUser, loginMutation, navigate]);

    return (
        <>
            {stage === 1 && (
                <AuthSection stage={stage} currentTransition={currentTransition}>
                    <Welcome email={email} handleContinue={handleContinue} handleEmailChange={handleEmailChange} />
                </AuthSection>
            )}
            {stage === 2 && (
                <AuthSection stage={stage} currentTransition={currentTransition}>
                    <Password
                        email={email}
                        password={password}
                        handleReverse={handleReverse}
                        handlePasswordChange={handlePasswordChange}
                        handleLogin={handleLogin}
                    />
                </AuthSection>
            )}
        </>
    );
};

export default Login;
