import { createRoot, hydrateRoot } from 'react-dom/client';
import App, { loadSearchPage } from './App';

const container = document.getElementById('app');
if (container === null) {
  throw new Error('The app root element is missing.');
}

if (container.dataset.prerendered === 'search') {
  void loadSearchPage()
    .then(({ default: Search }) => {
      hydrateRoot(container, <App SearchComponent={Search} />);
    })
    .catch(() => {
      // Keep the normal route loader as a fallback if an early chunk request failed.
      createRoot(container).render(<App />);
    });
} else {
  createRoot(container).render(<App />);
}
