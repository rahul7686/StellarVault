import { describe, it, expect } from 'vitest';
import { normalizeStatus } from './App';

describe('normalizeStatus', () => {
  it('returns ready if saved >= goal', () => {
    // Goal reached before time
    const status = normalizeStatus(1000, 1000, '2050-01-01');
    expect(status).toBe('ready');
  });

  it('returns ready if time has passed', () => {
    // Time passed but goal not reached
    const status = normalizeStatus(500, 1000, '2000-01-01');
    expect(status).toBe('ready');
  });

  it('returns locked if time has not passed and goal not reached', () => {
    const status = normalizeStatus(500, 1000, '2050-01-01');
    expect(status).toBe('locked');
  });
});
