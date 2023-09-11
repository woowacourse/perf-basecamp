import { createRoot } from 'react-dom/client';
import App from './App';
import { Suspense } from 'react';

const root = createRoot(document.getElementById('app')!);
root.render(
  <Suspense fallback={<div>로딩중입니다.</div>}>
    <App />
  </Suspense>
);
