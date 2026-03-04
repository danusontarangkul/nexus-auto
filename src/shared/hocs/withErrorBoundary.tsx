import React, { ComponentType } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../screens/ErrorFallBack';

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  title?: string,
) {
  return (props: P) => (
    <ErrorBoundary
      FallbackComponent={(errorProps) => (
        <ErrorFallback {...errorProps} title={title} />
      )}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
}
