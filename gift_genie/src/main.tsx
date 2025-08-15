import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/layout';
import HomePage from './pages/home';
import SignInPage from './pages/signIn';
import SignUpPage from './pages/signUp';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/home',
            Component: HomePage,
          },
        ],
      },
      {
        path: '/sign-in',
        Component: SignInPage,
      },
      {
        path: '/sign-up',
        Component: SignUpPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
