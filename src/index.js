import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import "@egjs/flicking-plugins/dist/arrow.css";
import './assets/styles/css/reset.css';
// import styles
import "@egjs/flicking/dist/flicking.css"; // Supports IE10+, using CSS flex
import './assets/styles/css/commons.css';
import ReactModal from 'react-modal';
import App from './App';
import ModalsProvider from './components/ModalProvider';
// import reportWebVitals from './reportWebVitals';

ReactModal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter future={{
      v7_relativeSplatPath: true,
      // v7_fetcherPersist: true,
      // v7_normalizeFormMethod: true,
      // v7_partialHydration: true,
      // v7_skipActionErrorRevalidation: true,
      v7_startTransition: true
    }}>
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
