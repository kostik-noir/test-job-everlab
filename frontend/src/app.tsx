import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AbnormalObservationsViewerPage from './pages/abnormal-observations-view';
import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AbnormalObservationsViewerPage/>
  }
]);

export default () => {
  return (
    <RouterProvider router={router}/>
  )
}
