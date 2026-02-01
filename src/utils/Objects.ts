import { isDeepStrictEqual } from 'node:util';

export class Objects {
	static isEqual(a: any, b: any): boolean {
		return isDeepStrictEqual(a, b);
	}

	static clone<T>(value: T): T {
		if (value === undefined) return undefined as T;

		return structuredClone(value);
	}

	static isObject(value: any): boolean {
		return value !== null && typeof value === 'object' && !Array.isArray(value);
	}
}
