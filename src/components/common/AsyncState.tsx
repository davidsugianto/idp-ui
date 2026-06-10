import type { ReactNode } from 'react';
import { Alert, Button, Empty, Flex, Spin } from 'antd';

interface AsyncStateProps {
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  loadingFallback?: ReactNode;
  emptyFallback?: ReactNode;
  children: ReactNode;
  onRetry?: () => void;
}

function AsyncState({
  isLoading = false,
  error,
  isEmpty = false,
  loadingFallback,
  emptyFallback,
  children,
  onRetry,
}: AsyncStateProps) {
  if (isLoading) {
    return (
      <>
        {loadingFallback ?? (
          <Flex justify="center" style={{ padding: '64px 0' }}>
            <Spin size="large" />
          </Flex>
        )}
      </>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Something went wrong"
        description={error.message}
        action={
          onRetry ? (
            <Button onClick={onRetry}>
              Retry
            </Button>
          ) : undefined
        }
      />
    );
  }

  if (isEmpty) {
    return <>{emptyFallback ?? <Empty />}</>;
  }

  return <>{children}</>;
}

export default AsyncState;
