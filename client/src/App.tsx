import { StrictMode } from 'react';
import { Provider as ContextProvider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Dashboard from './pages/dashboard/Dashboard';
import Planner from './pages/planner/Planner';

import { store } from './store/index';
import ThemeWrapper from './components/wrappers/theme/ThemeWrapper';
import ResponsiveWrapper from './components/wrappers/responsive/ResponsiveWrapper';
import Recipes from './pages/recipes/Recipes';
import Navbar from './components/navbar/Navbar';

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
        path: '/recipes',
        element: <Recipes />
    },
    {
        path: '/*',
        element: <Navigate to="/dashboard" replace={true} />
    }
];

export function CoreApp() {
    return (
        <div className="app">
            <Router>
                {/* <Header /> */}
                <Navbar />
                <Routes>
                    {routes.map(({ path, element }) => (
                        <Route path={path} element={element} key={path} />
                    ))}
                </Routes>
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
