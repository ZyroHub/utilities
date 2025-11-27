import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Ansi } from './Ansi.js';
import { Terminal } from './Terminal.js';

describe('Terminal Utility', () => {
	const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

	const originalEnv = process.env;

	beforeEach(() => {
		consoleSpy.mockClear();

		process.env = { ...originalEnv };

		process.env.npm_package_name = 'TEST-PKG';
		process.env.TIMEZONE = 'UTC';
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('should log a success message with green color', () => {
		Terminal.success('TEST', 'Success Message');

		expect(consoleSpy).toHaveBeenCalledTimes(1);

		const [_prefix, flag, content] = consoleSpy.mock.calls[0];

		expect(flag).toContain('TEST');
		expect(content).toBe('Success Message');
	});

	it('should log an error message with red color', () => {
		Terminal.error('DB', 'Error Message');

		const [_prefix, flag, content] = consoleSpy.mock.calls[0];

		expect(flag).toContain('[DB]');
		expect(content).toBe('Error Message');
	});

	it('should handle objects in content correctly', () => {
		const obj = { id: 1 };

		Terminal.info('INFO', ['Data:', obj]);

		expect(consoleSpy).toHaveBeenCalledWith(expect.any(String), expect.any(String), 'Data:', obj);
	});

	it('should format prefix correctly with package name', () => {
		process.env.npm_package_name = 'MY-APP';
		Terminal.warn('WARN', 'Message');

		const [prefix] = consoleSpy.mock.calls[0];

		expect(prefix).toContain('MY-APP');
		expect(prefix).toMatch(/\d{2}\/\d{2}/);
	});

	it('should NOT include package name in prefix if env var is missing', () => {
		delete process.env.npm_package_name;
		Terminal.log('LOG', Ansi.white, 'Message');

		const [prefix] = consoleSpy.mock.calls[0];

		expect(prefix).not.toContain('undefined');
		expect(prefix).not.toContain('null');
	});
});
