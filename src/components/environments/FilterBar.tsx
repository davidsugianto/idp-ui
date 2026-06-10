import { Input, Select, Space, Typography } from 'antd';
import type { EnvironmentListQuery } from '@/types/environment';

const { Text } = Typography;

interface FilterBarProps {
  value: EnvironmentListQuery;
  onChange: (nextValue: EnvironmentListQuery) => void;
  teams?: string[];
  clusters?: string[];
}

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Creating', value: 'creating' },
  { label: 'Deleting', value: 'deleting' },
  { label: 'Error', value: 'error' },
  { label: 'Inactive', value: 'inactive' },
] as const;

function FilterBar({ value, onChange, teams = [], clusters = [] }: FilterBarProps) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 20,
        background: '#ffffff',
        border: '1px solid #e6edf7',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
      }}
    >
      <Space direction="vertical" size={14} style={{ width: '100%' }}>
        <Space direction="vertical" size={4}>
          <Text strong>Environment filters</Text>
          <Text type="secondary">Refine the workspace list by search term, ownership, cluster, or delivery status.</Text>
        </Space>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input.Search
            allowClear
            placeholder="Search environments"
            value={value.search}
            onChange={(event) => onChange({ ...value, search: event.target.value })}
            style={{ width: 280 }}
          />
          <Space wrap>
            <Select
              style={{ width: 180 }}
              options={[{ label: 'All teams', value: 'all' }, ...teams.map((team) => ({ label: team, value: team }))]}
              value={value.team ?? 'all'}
              onChange={(team) => onChange({ ...value, team: team === 'all' ? undefined : team })}
            />
            <Select
              style={{ width: 180 }}
              options={[{ label: 'All clusters', value: 'all' }, ...clusters.map((cluster) => ({ label: cluster, value: cluster }))]}
              value={value.cluster ?? 'all'}
              onChange={(cluster) => onChange({ ...value, cluster: cluster === 'all' ? undefined : cluster })}
            />
            <Select
              style={{ width: 180 }}
              options={statusOptions.map((option) => ({ ...option }))}
              value={value.status ?? 'all'}
              onChange={(status) => onChange({ ...value, status })}
            />
          </Space>
        </Space>
      </Space>
    </div>
  );
}

export default FilterBar;
