import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

// Scaffold entry point. The composition root and router (src/app) are designed in Trussel
// pass "Dumbbell Dude v1" and wired in here during implementation.
const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <p style={{ padding: 16 }}>Dumbbell Dude — lift heavy, log heavier.</p>
  </StrictMode>,
);
