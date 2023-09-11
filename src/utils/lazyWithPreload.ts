import { ComponentType, LazyExoticComponent, lazy } from 'react';

export default function lazyWithPreload<T = any>(
  factory: () => Promise<{ default: ComponentType<T> }>
): [Component: LazyExoticComponent<ComponentType<T>>, preload: () => void] {
  return [lazy(factory), factory];
}
