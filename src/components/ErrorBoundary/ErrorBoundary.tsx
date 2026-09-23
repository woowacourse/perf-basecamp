import { Component, ReactNode } from 'react';

import styles from './ErrorBoundary.module.css';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles.errorSection}>
          <p>Something went wrong while loading this page.</p>
          <button
            type="button"
            className={styles.reloadButton}
            onClick={() => window.location.reload()}
          >
            reload
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
