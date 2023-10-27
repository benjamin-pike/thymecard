import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

const usePremium = () => {
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const decodedToken = accessToken ? (jwt_decode(accessToken) as any) : null;
        setIsPremium(decodedToken?.claims?.premium ?? false);
    }, []);

    return isPremium;
};

export default usePremium;
