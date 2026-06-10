import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../FilterBar';

describe('FilterBar', () => {
  it('emits search changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FilterBar
        value={{ search: '', status: 'all' }}
        onChange={onChange}
      />,
    );

    await user.type(screen.getByPlaceholderText('Search environments'), 'payments');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith({ search: 'payments', status: 'all' });
  });
});
