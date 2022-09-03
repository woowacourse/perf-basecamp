import { createRoot } from 'react-dom/client';
import App from './App';

import { GifContextProvider } from './context/Gif';

const root = createRoot(document.getElementById('app')!);
root.render(
  <GifContextProvider>
    <App />
  </GifContextProvider>
);
