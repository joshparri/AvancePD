import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

import { initEyeCareCoordinator } from '../shared/health/eyeCareCoordinator';

// initialize shared eye-care coordinator
initEyeCareCoordinator();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
