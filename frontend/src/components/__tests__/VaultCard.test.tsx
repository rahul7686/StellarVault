import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VaultCard, Vault } from '../VaultCard';

describe('VaultCard component', () => {
  afterEach(() => {
    cleanup();
  });

  const sampleVault: Vault = {
    id: 1,
    name: 'Emergency Fund',
    asset: 'XLM',
    saved: 500,
    goal: 1000,
    unlockAt: '2026-12-31',
    status: 'locked',
    source: 'onchain',
  };

  it('renders vault title, asset and progress percentage', () => {
    const onDeposit = vi.fn();
    const onWithdraw = vi.fn();

    render(<VaultCard vault={sampleVault} onDeposit={onDeposit} onWithdraw={onWithdraw} />);

    expect(screen.getByText('Emergency Fund')).toBeDefined();
    expect(screen.getByText('500 / 1000 XLM')).toBeDefined();
    expect(screen.getByText('Progress (50%)')).toBeDefined();
  });

  it('triggers deposit callback on button click', () => {
    const onDeposit = vi.fn();
    const onWithdraw = vi.fn();

    render(<VaultCard vault={sampleVault} onDeposit={onDeposit} onWithdraw={onWithdraw} />);

    const depositBtn = screen.getAllByRole('button', { name: 'Deposit' })[0];
    fireEvent.click(depositBtn);

    expect(onDeposit).toHaveBeenCalledWith(sampleVault);
  });
});
