import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Alert, Button, Input, Select, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TemplateTable from '@/components/templates/TemplateTable';
import SectionCard from '@/components/common/SectionCard';
import PageHeader from '@/components/common/PageHeader';
import { useTemplates, templateQueryKeys } from '@/hooks/useEnvironments';
import { listTemplateVersions } from '@/services/environments';
import { useAuthStore } from '@/stores/authStore';

const categoryOptions = [
  { label: 'All categories', value: '' },
  { label: 'Service', value: 'service' },
  { label: 'Infrastructure', value: 'infra' },
  { label: 'Database', value: 'database' },
];

export default function TemplateListPage() {
  const navigate = useNavigate();
  const templates = useTemplates();
  const isAdmin = useAuthStore((s) => s.user?.roles.includes('admin') ?? false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const versionQueries = useQueries({
    queries: (templates.data ?? []).map((t) => ({
      queryKey: templateQueryKeys.versions(t.id),
      queryFn: () => listTemplateVersions(t.id),
      enabled: Boolean(t.id),
      staleTime: 60_000,
    })),
  });

  const enriched = useMemo(() => {
    if (!templates.data) return [];
    return templates.data.map((t, i) => {
      const versions = versionQueries[i]?.data;
      const derivedVersion = t.latestVersion
        || versions?.find((v) => v.isLatest)?.version;
      return { ...t, latestVersion: derivedVersion };
    });
  }, [templates.data, versionQueries]);

  const filtered = useMemo(() => {
    return enriched.filter((t) => {
      const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [enriched, search, category]);

  if (templates.isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load templates"
        description={(templates.error as Error)?.message || 'Please retry.'}
        action={<Button size="small" onClick={() => templates.refetch()}>Retry</Button>}
      />
    );
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        eyebrow="Platform catalog"
        title="Templates"
        description="Browse reusable environment templates available for your team. Select a template to view its versions and parameters."
        actions={
          isAdmin
            ? [{ key: 'create', label: <><PlusOutlined /> Create Template</>, type: 'primary', onClick: () => navigate('/admin/templates/new') }]
            : undefined
        }
      />

      <SectionCard bodyStyle={{ padding: 28 }}>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }} wrap>
          <Space>
            <Input.Search
              placeholder="Search templates by name"
              allowClear
              onSearch={setSearch}
              onChange={(e) => !e.target.value && setSearch('')}
              style={{ width: 260 }}
            />
            <Select
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              style={{ width: 160 }}
            />
          </Space>
        </Space>

        <TemplateTable
          data={filtered}
          loading={templates.isLoading || versionQueries.some((q) => q.isLoading)}
          onRow={(record) => ({
            onClick: () => navigate(`/templates/${record.id}`),
          })}
        />
      </SectionCard>
    </Space>
  );
}

