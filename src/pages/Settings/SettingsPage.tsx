import { Col, Row, Space } from 'antd';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import SectionCard from '@/components/common/SectionCard';

function SettingsPage() {
  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      <PageHeader
        title="Settings"
        description="Manage personal access, automation credentials, and other workspace preferences."
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <SectionCard title="API key management" extra={<Link to="/settings/api-keys">Open</Link>}>
            <span style={{ color: '#595959' }}>Create, review, and revoke API keys used by CI/CD pipelines and other automation.</span>
          </SectionCard>
        </Col>
      </Row>
    </Space>
  );
}

export default SettingsPage;
