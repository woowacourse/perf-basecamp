import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('app');

if (container === null) {
  throw new Error('Root element #app not found');
}

const root = createRoot(container);
root.render(<App />);
