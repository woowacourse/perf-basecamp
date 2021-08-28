import loadable from '@loadable/component'

const SearchLoadable = loadable(() => import('../Search/Search'))

export { SearchLoadable };
