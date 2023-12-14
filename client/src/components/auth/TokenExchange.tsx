import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { sendRequest } from '@/lib/api/sendRequest';
import useUser from '@/hooks/user/useUser';
import LoadingDots from '../common/loading-dots/LoadingDots';

const TokenExchange = () => {
    const navigate = useNavigate();
    const { loginUser } = useUser();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const credentialId = queryParams.get('credentialId');
    const token = queryParams.get('token');

    useQuery(
        ['tokenExchange'],
        async () => {
            const url = '/api/auth/session/exchange';
            const method = 'POST';

            const { status, data } = await sendRequest(url, method, {
                body: { credentialId, token }
            });

            if (status !== 201) {
                throw new Error(data.message);
            }

            return data;
        },
        {
            onSuccess: (data) => {
                const { user, session } = data;

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
            }
        }
    );

    return <LoadingDots />;
};

export default TokenExchange;
