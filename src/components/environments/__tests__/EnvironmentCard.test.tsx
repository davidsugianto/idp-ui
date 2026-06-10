import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EnvironmentCard from '../EnvironmentCard';
import type { Environment } from '@/types/environment';

const environment: Environment = {
  id: 'env-1',
  teamId: 'team-1',
  name: 'payments-dev',
  description: 'Development environment',
  namespace: 'idp-team-1-payments-dev',
  status: 'active',
  gitRepoUrl: 'https://github.com/example/payments',
  gitRevision: 'main',
  manifestPath: 'deploy/dev',
  clusterName: 'cluster-a',
  errorCount: 0,
  createdAt: '2026-06-01T00:00:00Z',
  updatedAt: '2026-06-05T00:00:00Z',
};

describe('EnvironmentCard', () => {
  it('renders environment details and detail link', () => {
    render(
      <MemoryRouter>
        <EnvironmentCard environment={environment} />
      </MemoryRouter>,
    );

    expect(screen.getByText('payments-dev')).toBeInTheDocument();
    expect(screen.getByText('idp-team-1-payments-dev')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'payments-dev' })).toHaveAttribute('href', '/environments/env-1');
  });
});
