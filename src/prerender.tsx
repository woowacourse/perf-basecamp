import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import AppFrame from './AppFrame';
import Search from './pages/Search/Search';

// Render the same empty-list Search state that the browser hydrates. The data
// request stays in the HTML bootstrap; React effects never run during this build.
export const renderSearch = (publicPath: string): string =>
  renderToString(
    <StaticRouter basename={publicPath} location={`${publicPath}search`}>
      <AppFrame SearchComponent={Search} />
    </StaticRouter>
  );
