import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import CreateLineupPage from './pages/CreateLineupPage.jsx';
import LineupDetailPage from './pages/LineupDetailPage.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is now the layout shell
    children: [
      {
        index: true, // This makes HomePage the default child route
        element: <HomePage />,
      },
      {
        path: 'lineup/:id',
        element: <LineupDetailPage />,
      },
      {
        path: 'create',
        element: <CreateLineupPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
