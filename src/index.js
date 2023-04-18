import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Removed <React.StrictMode> </ React.StrictMode> to allow single render at users
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
