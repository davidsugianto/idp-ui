import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import WorkloadTable from '../WorkloadTable';
import type { Workload } from '@/types/environment';

const workloads: Workload[] = [
  {
    name: 'api',
    kind: 'Deployment',
    status: 'Running',
    desiredReplicas: 2,
    readyReplicas: 2,
    image: 'ghcr.io/example/api:latest',
  },
];

describe('WorkloadTable', () => {
  it('renders workload rows', () => {
    render(<WorkloadTable workloads={workloads} />);

    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('Deployment')).toBeInTheDocument();
    expect(screen.getByText('2/2')).toBeInTheDocument();
  });
});
