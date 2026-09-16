import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('app');
if (rootElement == null) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(<App />);
