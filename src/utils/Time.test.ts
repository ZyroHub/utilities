import { describe, it, expect } from 'vitest';

import { Time } from './Time.js';

describe('Time Utility', () => {
	describe('duration', () => {
		it('should format milliseconds correctly', () => {
			expect(Time.duration(50)).toBe('50ms');
			expect(Time.duration(999)).toBe('999ms');
		});

		it('should format seconds correctly', () => {
			expect(Time.duration(1000)).toBe('1s');
			expect(Time.duration(1500)).toBe('1.5s');
			expect(Time.duration(59000)).toBe('59s');
		});

		it('should format minutes correctly', () => {
			expect(Time.duration(60000)).toBe('1m');
			expect(Time.duration(90000)).toBe('1.5m');
			expect(Time.duration(120000)).toBe('2m');
		});
	});

	describe('sleep', () => {
		it('should wait for the specified amount of time', async () => {
			const start = Date.now();
			const delay = 100;

			await Time.sleep(delay);

			const elapsed = Date.now() - start;

			expect(elapsed).toBeGreaterThanOrEqual(delay - 10);
		});
	});
});
