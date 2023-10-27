import { StrictMode } from 'react';
import { Provider as ContextProvider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { RootState, store } from './store/index';

import Auth from './pages/auth/Auth';
import Navbar from './components/navbar/Navbar';
import Dashboard from './pages/dashboard/Dashboard';
import Planner from './pages/planner/Planner';
import Recipes from './pages/recipes/Recipes';

import ThemeWrapper from './components/wrappers/theme/ThemeWrapper';
import ResponsiveWrapper from './components/wrappers/responsive/ResponsiveWrapper';

import 'react-toastify/dist/ReactToastify.css';
import RecipeProvider from './components/recipes/recipe/RecipeProvider';

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
        path: '/login',
        element: <Auth />
    },
    {
        path: '/register',
        element: <Auth />
    },
    {
        path: '/',
        element: <Navigate to="/login" replace={true} />
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
        path: '/recipes',
        element: <Recipes />
    },
    {
        path: '/recipes/create',
        element: <Recipes />
    },
    {
        path: '/recipes/:recipeId',
        element: <Recipes />
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
        <div className="app">
            <Router>
                {user.user ? (
                    <RecipeProvider>
                        <>
                            <Navbar />
                            <Routes>
                                {privateRoutes.map(({ path, element }) => (
                                    <Route path={path} element={element} key={path} />
                                ))}
                            </Routes>
                        </>
                    </RecipeProvider>
                ) : (
                    <Routes>
                        {publicRoutes.map(({ path, element }) => (
                            <Route path={path} element={element} key={path} />
                        ))}
                    </Routes>
                )}
                <ToastContainer className="toast" position="bottom-right" autoClose={2000} theme={theme} />
            </Router>
        </div>
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
                            <div id="drawer-root" />
                            <div id="modal-root" />
                        </QueryClientProvider>
                    </ResponsiveWrapper>
                </ThemeWrapper>
            </ContextProvider>
        </StrictMode>
    );
}

export default App;
