import { Navigate } from 'react-router-dom';
import { createToast } from '@/lib/toast/toast.utils';

const Error = () => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message') ?? undefined;

    if (message) {
        createToast('error', message);
    }

    return <Navigate to="/login" />;
};

export default Error;
