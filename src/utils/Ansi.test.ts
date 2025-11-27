import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ANSI_CODES, ANSI_CLOSE_CODES } from '../constants/ansi.js';
import type { Ansi as AnsiType } from './Ansi.js';

describe('Ansi Utility', () => {
	let Ansi: typeof AnsiType;

	beforeEach(async () => {
		vi.resetModules();
	});

	describe('When colors are ENABLED', () => {
		beforeEach(async () => {
			vi.doMock('@/constants/env.js', () => ({
				isEnvColorsAllowed: true
			}));

			const module = await import('./Ansi.js');
			Ansi = module.Ansi;
		});

		it('should wrap text with correct color codes (Red)', () => {
			const text = 'Hello World';
			const result = Ansi.red(text);

			expect(result).toBe(`${ANSI_CODES.red}${text}${ANSI_CLOSE_CODES.fg}`);
		});

		it('should handle number inputs correctly', () => {
			const number = 12345;
			const result = Ansi.blue(number);

			expect(result).toBe(`${ANSI_CODES.blue}12345${ANSI_CLOSE_CODES.fg}`);
		});

		it('should wrap text with correct background codes (BgBlue)', () => {
			const text = 'Background';
			const result = Ansi.bgBlue(text);

			expect(result).toBe(`${ANSI_CODES.bgBlue}${text}${ANSI_CLOSE_CODES.bg}`);
		});

		it('should wrap text with correct style codes (Bold)', () => {
			const text = 'Bold Text';
			const result = Ansi.bold(text);

			expect(result).toBe(`${ANSI_CODES.bold}${text}${ANSI_CLOSE_CODES.bold}`);
		});

		it('should handle nested colors correctly (Red inside Blue)', () => {
			const inner = Ansi.red('Red');
			const result = Ansi.blue(`Blue ${inner} Blue`);

			const expected = `${ANSI_CODES.blue}Blue ${ANSI_CODES.red}Red${ANSI_CLOSE_CODES.fg}${ANSI_CODES.blue} Blue${ANSI_CLOSE_CODES.fg}`;

			expect(result).toBe(expected);
		});

		it('should handle complex nesting (Bold inside Green)', () => {
			const inner = Ansi.bold('Important');
			const result = Ansi.green(`This is ${inner} text`);

			expect(result).toContain(ANSI_CODES.green);
			expect(result).toContain(ANSI_CODES.bold);
			expect(result).toContain(ANSI_CLOSE_CODES.bold);
			expect(result).toContain(ANSI_CLOSE_CODES.fg);
		});
	});

	describe('When colors are DISABLED (NO_COLOR)', () => {
		beforeEach(async () => {
			vi.doMock('@/constants/env.js', () => ({
				isEnvColorsAllowed: false
			}));

			const module = await import('./Ansi.js');
			Ansi = module.Ansi;
		});

		it('should return plain text without any ANSI codes', () => {
			const text = 'Plain Text';
			const result = Ansi.red(text);

			expect(result).toBe(text);
		});

		it('should return plain stringified number', () => {
			const number = 999;
			const result = Ansi.red(number);

			expect(result).toBe('999');
		});

		it('should return plain text even with nested calls', () => {
			const result = Ansi.blue(`Blue ${Ansi.red('Red')} Blue`);

			expect(result).toBe('Blue Red Blue');
		});
	});
});
