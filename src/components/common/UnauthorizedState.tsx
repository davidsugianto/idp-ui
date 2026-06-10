import type { ReactNode } from 'react';
import { Button } from 'antd';
import AppResultPage from './AppResultPage';

interface UnauthorizedStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  extra?: ReactNode;
}

function UnauthorizedState({
  title = 'Access denied',
  description = 'You do not have permission to view this page.',
  actionLabel,
  onAction,
  extra,
}: UnauthorizedStateProps) {
  const action =
    extra ??
    (actionLabel && onAction ? (
      <Button type="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null);

  return (
    <AppResultPage
      status="403"
      eyebrow="Restricted workspace"
      title={title}
      subTitle={description}
      hint="If you believe this is unexpected, confirm your account role or return to a workspace you can access."
      extra={action}
    />
  );
}

export default UnauthorizedState;
