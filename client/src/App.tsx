import { StrictMode } from 'react';
import { Provider as ContextProvider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/header/Header';
import Dashboard from './pages/dashboard/dashboard';
import Planner from './pages/planner/planner';

import { store } from './store/index';
import ThemeWrapper from './components/wrappers/theme/ThemeWrapper';
import ResponsiveWrapper from './components/wrappers/responsive/ResponsiveWrapper';

const queryClient = new QueryClient();

const routes = [
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/planner',
        element: <Planner />
    },
    {
        path: '/*',
        element: <Navigate to="/dashboard" replace={true} />
    }
];

export function CoreApp() {
    return (
        <Router>
            <Header />
            <Routes>
                {routes.map(({ path, element }) => (
                    <Route path={path} element={element} key={path} />
                ))}
            </Routes>
        </Router>
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
