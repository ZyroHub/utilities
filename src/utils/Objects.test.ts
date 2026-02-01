import { describe, expect, it } from 'vitest';

import { Objects } from './Objects.js';

describe('Objects Utils', () => {
	describe('isEqual', () => {
		it('should return true for identical primitive values', () => {
			expect(Objects.isEqual(1, 1)).toBe(true);
			expect(Objects.isEqual('zyro', 'zyro')).toBe(true);
			expect(Objects.isEqual(true, true)).toBe(true);
			expect(Objects.isEqual(null, null)).toBe(true);
			expect(Objects.isEqual(undefined, undefined)).toBe(true);
		});

		it('should return true for identical objects/arrays', () => {
			const obj1 = { name: 'Zyro', props: { active: true } };
			const obj2 = { name: 'Zyro', props: { active: true } };
			expect(Objects.isEqual(obj1, obj2)).toBe(true);

			const arr1 = [1, { a: 1 }];
			const arr2 = [1, { a: 1 }];
			expect(Objects.isEqual(arr1, arr2)).toBe(true);
		});

		it('should return false for different values', () => {
			expect(Objects.isEqual(1, 2)).toBe(false);
			expect(Objects.isEqual({ a: 1 }, { a: 2 })).toBe(false);
			expect(Objects.isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
		});

		it('should handle Date comparisons correctly', () => {
			const date1 = new Date('2024-01-01');
			const date2 = new Date('2024-01-01');
			const date3 = new Date('2024-01-02');

			expect(Objects.isEqual(date1, date2)).toBe(true);
			expect(Objects.isEqual(date1, date3)).toBe(false);
		});
	});

	describe('clone', () => {
		it('should deep clone an object', () => {
			const original = {
				name: 'Zyro',
				config: { theme: 'dark', nested: { id: 1 } },
				tags: ['core', 'utils']
			};

			const copy = Objects.clone(original);

			expect(copy).toEqual(original);
			expect(copy).not.toBe(original);
			expect(copy.config).not.toBe(original.config);
		});

		it('should not mutate original when copy is changed', () => {
			const original = { list: [1, 2, 3] };
			const copy = Objects.clone(original);

			copy.list.push(4);

			expect(original.list).toHaveLength(3);
			expect(copy.list).toHaveLength(4);
		});

		it('should handle dates in cloning', () => {
			const original = { created: new Date() };
			const copy = Objects.clone(original);

			expect(copy.created).toBeInstanceOf(Date);
			expect(copy.created.getTime()).toBe(original.created.getTime());
			expect(copy.created).not.toBe(original.created);
		});
	});
});
