import { IsString, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import * as yup from 'yup';
import { z } from 'zod';

import { Validator } from './Validator.js';

class UserClass {
	@IsString()
	name!: string;

	@IsNumber()
	age!: number;
}

describe('Validator Utility (Structured Errors)', () => {
	const validData = { name: 'Zyro', age: 10 };
	const invalidData = { name: 123, age: 'dez' };

	describe('Zod Support', () => {
		const schema = z.object({
			name: z.string(),
			age: z.number()
		});

		it('should validate correctly', async () => {
			const result = await Validator.validate(schema, validData);
			expect(result.success).toBe(true);
		});

		it('should return structured errors', async () => {
			const result = await Validator.validate(schema, invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.errors).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							path: 'name',
							message: expect.stringMatching(/string/i)
						}),
						expect.objectContaining({
							path: 'age'
						})
					])
				);
			}
		});
	});

	describe('Yup Support', () => {
		const schema = yup.object({
			name: yup.string().required(),
			age: yup.number().required()
		});

		it('should validate correctly', async () => {
			const result = await Validator.validate(schema, validData);
			expect(result.success).toBe(true);
		});

		it('should return structured errors', async () => {
			const result = await Validator.validate(schema, invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.errors).toEqual(expect.arrayContaining([expect.objectContaining({ path: 'age' })]));
			}
		});
	});

	describe('Class-Validator Support', () => {
		it('should return structured errors', async () => {
			const result = await Validator.validate(UserClass, invalidData);
			expect(result.success).toBe(false);

			if (!result.success) {
				expect(result.errors).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							path: 'name',
							type: 'isString'
						})
					])
				);
			}
		});
	});
});
