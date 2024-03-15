import { StrictMode } from 'react';
import { Settings } from 'luxon';
import { Provider as ContextProvider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { RootState, store } from './store/index';

import Auth from './pages/auth/Auth';
import Navbar from './components/navbar/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import Planner from './pages/planner/Planner';
import Food from './pages/food/Food';
import RecipeProvider from './components/providers/RecipeProvider';
import PlanProvider from './components/providers/PlanProvider';

import ThemeWrapper from './components/wrappers/theme/ThemeWrapper';
import ResponsiveWrapper from './components/wrappers/responsive/ResponsiveWrapper';

import 'react-toastify/dist/ReactToastify.css';

Settings.throwOnInvalid = true;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
});

const publicRoutes = [
    {
        path: '/*',
        element: <Auth />
    }
];

const privateRoutes = [
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/planner',
        element: <Planner />
    },
    {
        path: '/food',
        element: <Food />
    },
    {
        path: '/food/recipes/create',
        element: <Food />
    },
    {
        path: '/food/recipes/:recipeId',
        element: <Food />
    },
    {
        path: '/*',
        element: <Navigate to="/dashboard" replace={true} />
    }
];

export function CoreApp() {
    const theme = useSelector((state: RootState) => state.theme);
    const user = useSelector((state: RootState) => state.user);

    return (
        <>
            <div className="app">
                <Router>
                    {user.user ? (
                        <RecipeProvider>
                            <PlanProvider>
                                <>
                                    <Navbar />
                                    <Routes>
                                        {privateRoutes.map(({ path, element }) => (
                                            <Route path={path} element={element} key={path} />
                                        ))}
                                    </Routes>
                                </>
                            </PlanProvider>
                        </RecipeProvider>
                    ) : (
                        <Routes>
                            {publicRoutes.map(({ path, element }) => (
                                <Route path={path} element={element} key={path} />
                            ))}
                        </Routes>
                    )}
                </Router>
            </div>
            <div id="drawer-root" />
            <div id="modal-root" />
            <div id="search-root" />
            <ToastContainer className="toast" position="bottom-right" theme={theme} limit={3} />
        </>
    );
}

export function App() {
    return (
        <StrictMode>
            <ContextProvider store={store}>
                <ThemeWrapper>
                    <ResponsiveWrapper>
                        <QueryClientProvider client={queryClient}>
                            <CoreApp />
                        </QueryClientProvider>
                    </ResponsiveWrapper>
                </ThemeWrapper>
            </ContextProvider>
        </StrictMode>
    );
}

export default App;
