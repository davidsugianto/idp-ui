import { useNavigate } from 'react-router-dom';
import AppResultPage, { ResultAction } from '@/components/common/AppResultPage';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <AppResultPage
      status="404"
      eyebrow="Page not found"
      title="We couldn’t find that page"
      subTitle="The link may be outdated, or the page may have moved to a different workspace path."
      hint="Try returning to the dashboard or go back to the previous page."
      extra={[
        <ResultAction key="home" label="Go to dashboard" onClick={() => navigate('/')} />,
        <ResultAction key="back" label="Go back" type="default" onClick={() => navigate(-1)} />,
      ]}
    />
  );
}

export default NotFoundPage;
