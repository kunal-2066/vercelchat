import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Temporarily disabled - may be interfering
// import './diagnostic'

const syncAppHeight = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};

syncAppHeight();
window.addEventListener('resize', syncAppHeight);
window.visualViewport?.addEventListener('resize', syncAppHeight);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
