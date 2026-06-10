import { useNavigate } from 'react-router-dom';
import AppResultPage, { ResultAction } from '@/components/common/AppResultPage';

function ServerErrorPage() {
  const navigate = useNavigate();

  return (
    <AppResultPage
      status="500"
      eyebrow="Service issue"
      title="Something went wrong"
      subTitle="The application hit an unexpected problem while preparing this page."
      hint="You can retry from the previous view or return to the dashboard while the issue clears."
      extra={[
        <ResultAction key="home" label="Go to dashboard" onClick={() => navigate('/')} />,
        <ResultAction key="back" label="Go back" type="default" onClick={() => navigate(-1)} />,
      ]}
    />
  );
}

export default ServerErrorPage;
