import { ReactComponent as Brand } from '@/assets/brand.svg';
import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '@/components/auth/Login';
import FullRegister from '@/components/auth/Register';
import PartialRegister from '@/components/auth/PartialRegister';
import Error from '@/components/auth/Error';
import TokenExchange from '@/components/auth/TokenExchange';

import mockup from '@/assets/mockup.png';

import styles from './auth.module.scss';

const Auth = () => {
    const routes = [
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <FullRegister />
        },
        {
            path: '/register/partial',
            element: <PartialRegister />
        },
        {
            path: '/oauth/success',
            element: <PartialRegister />
        },
        {
            path: '/error',
            element: <Error />
        },
        {
            path: '/exchange',
            element: <TokenExchange />
        },
        {
            path: '*',
            element: <Navigate to="/login" />
        }
    ];

    return (
        <main className={styles.auth}>
            <section className={styles.left}>
                <div className={styles.brand}>
                    <Brand />
                    <h1>thymecard</h1>
                </div>
                <Routes>
                    {routes.map(({ path, element }) => (
                        <Route key={path} path={path} element={element} />
                    ))}
                </Routes>
                <div className={styles.terms}>
                    <p>Terms of Use</p>|<p>Privacy Policy</p>
                </div>
            </section>
            <section className={styles.right}>
                <div className={styles.wrapper}>
                    <img src={mockup} />
                </div>
            </section>
        </main>
    );
};

export default Auth;
