import type { ReactNode } from 'react';
import { Space } from 'antd';

interface ManagementToolbarProps {
  primary?: ReactNode;
  secondary?: ReactNode;
}

function ManagementToolbar({ primary, secondary }: ManagementToolbarProps) {
  return (
    <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
      <Space wrap>{primary}</Space>
      <Space wrap>{secondary}</Space>
    </Space>
  );
}

export default ManagementToolbar;
