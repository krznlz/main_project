import React from 'react';
import { createRoot } from 'react-dom/client';
import BriefApp from './components/brief/BriefApp.jsx';
import '../stylesheets/brief.css';

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<BriefApp />);