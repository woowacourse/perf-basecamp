import loadable from '@loadable/component'

const SearchLoadable = loadable(() => import('../Search/Search'), {
  fallback: <div>Loading...</div>
})

export { SearchLoadable };
