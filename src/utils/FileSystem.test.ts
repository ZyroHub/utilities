import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { FileSystem } from './FileSystem.js';
import { Terminal } from './Terminal.js';

vi.mock('node:fs/promises');

vi.mock('./Terminal.js', () => ({
	Terminal: {
		error: vi.fn()
	}
}));

describe('FileSystem Utility', () => {
	const ROOT_DIR = path.resolve('/test-root');

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('shouldIgnoreFile', () => {
		it('should ignore files based on exact string match', () => {
			const ignoreList = ['ignored.ts', 'config.json'];
			expect(FileSystem.shouldIgnoreFile('ignored.ts', ignoreList)).toBe(true);
			expect(FileSystem.shouldIgnoreFile('app.ts', ignoreList)).toBe(false);
		});

		it('should ignore files based on RegExp', () => {
			const ignoreList = [/\.test\.ts$/, /^temp_/];
			expect(FileSystem.shouldIgnoreFile('FileSystem.test.ts', ignoreList)).toBe(true);
			expect(FileSystem.shouldIgnoreFile('temp_data.json', ignoreList)).toBe(true);
			expect(FileSystem.shouldIgnoreFile('FileSystem.ts', ignoreList)).toBe(false);
		});
	});

	describe('shouldIncludeFile', () => {
		it('should include files based on exact string match', () => {
			const filterList = ['include-me.ts', 'data.json'];
			expect(FileSystem.shouldIncludeFile('include-me.ts', filterList)).toBe(true);
			expect(FileSystem.shouldIncludeFile('other.ts', filterList)).toBe(false);
		});

		it('should include files based on RegExp', () => {
			const filterList = [/\.config\.ts$/, /^main_/];
			expect(FileSystem.shouldIncludeFile('app.config.ts', filterList)).toBe(true);
			expect(FileSystem.shouldIncludeFile('main_file.json', filterList)).toBe(true);
			expect(FileSystem.shouldIncludeFile('other.ts', filterList)).toBe(false);
		});
	});

	describe('loadFolder', () => {
		const setupMockFileSystem = (structure: Record<string, string[]>) => {
			vi.mocked(fs.readdir).mockImplementation(async dirPath => {
				const key = dirPath.toString();
				return (structure[key] as any) || [];
			});

			vi.mocked(fs.lstat).mockImplementation(async filePath => {
				const strPath = filePath.toString();
				const isDirectory = !strPath.includes('.');

				if (strPath.includes('NON_EXISTENT')) return null;

				return {
					isDirectory: () => isDirectory
				} as any;
			});
		};

		it('should load files recursively', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['file1.ts', 'subfolder'],
				[path.join(ROOT_DIR, 'subfolder')]: ['file2.ts']
			});

			const files = await FileSystem.loadFolder(ROOT_DIR);

			expect(files).toHaveLength(2);
			expect(files.map(f => f.name)).toEqual(expect.arrayContaining(['file1.ts', 'file2.ts']));
			expect(fs.readdir).toHaveBeenCalledTimes(2);
		});

		it('should respect ignore_files options', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['valid.ts', 'ignore-me.ts', 'test.spec.ts']
			});

			const files = await FileSystem.loadFolder(ROOT_DIR, {
				ignore_files: ['ignore-me.ts', /\.spec\.ts$/]
			});

			expect(files).toHaveLength(1);
			expect(files[0].name).toBe('valid.ts');
		});

		it('should respect ignore_folders options', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['file1.ts', 'node_modules', 'src'],
				[path.join(ROOT_DIR, 'node_modules')]: ['lib.ts'],
				[path.join(ROOT_DIR, 'src')]: ['main.ts']
			});

			const files = await FileSystem.loadFolder(ROOT_DIR, {
				recursive: true,
				ignore_folders: ['node_modules']
			});

			const fileNames = files.map(f => f.name);
			expect(fileNames).toContain('file1.ts');
			expect(fileNames).toContain('main.ts');
			expect(fileNames).not.toContain('lib.ts');
		});

		it('should respect filter_files options', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['include.ts', 'exclude.js', 'also_include.json']
			});

			const files = await FileSystem.loadFolder(ROOT_DIR, {
				filter_files: [/\.ts$/, 'also_include.json']
			});

			expect(files).toHaveLength(2);
			const fileNames = files.map(f => f.name);
			expect(fileNames).toContain('include.ts');
			expect(fileNames).toContain('also_include.json');
			expect(fileNames).not.toContain('exclude.js');
		});

		it('should respect filter_folders options with files', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['file1.ts', 'include_this', 'exclude_this'],
				[path.join(ROOT_DIR, 'include_this')]: ['file2.ts'],
				[path.join(ROOT_DIR, 'exclude_this')]: ['file3.ts']
			});

			const files = await FileSystem.loadFolder(ROOT_DIR, {
				recursive: true,
				filter_folders: ['include_this']
			});

			const fileNames = files.map(f => f.name);
			expect(fileNames).toContain('file1.ts');
			expect(fileNames).toContain('file2.ts');
			expect(fileNames).not.toContain('file3.ts');
		});

		it('should execute callbacks correctly', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['fileA.ts', 'fileB.ts']
			});

			const callbackSingle = vi.fn();
			const callbackAll = vi.fn();

			await FileSystem.loadFolder(ROOT_DIR, {}, callbackAll, callbackSingle);

			expect(callbackSingle).toHaveBeenCalledTimes(2);
			expect(callbackAll).toHaveBeenCalledTimes(1);

			const resultArgs = callbackAll.mock.calls[0][0];
			expect(resultArgs).toHaveLength(2);
		});

		it('should handle import errors gracefully (catching exceptions)', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['broken.ts']
			});

			const files = await FileSystem.loadFolder(ROOT_DIR, { auto_import: true });

			expect(files).toHaveLength(1);
			expect(files[0].content).toBeNull();

			expect(Terminal.error).toHaveBeenCalled();
			expect(vi.mocked(Terminal.error).mock.calls[0][0]).toBe('FileSystem');
		});

		it('should skip import if auto_import is false', async () => {
			setupMockFileSystem({
				[ROOT_DIR]: ['data.json']
			});

			const files = await FileSystem.loadFolder(ROOT_DIR, { auto_import: false });

			expect(files).toHaveLength(1);
			expect(files[0].content).toBeNull();
			expect(Terminal.error).not.toHaveBeenCalled();
		});

		it('should return empty array if directory does not exist', async () => {
			vi.mocked(fs.lstat).mockRejectedValueOnce(new Error('ENOENT'));

			const callback = vi.fn();
			const files = await FileSystem.loadFolder('/NON_EXISTENT_PATH', {}, callback);

			expect(files).toEqual([]);
			expect(callback).toHaveBeenCalledWith([]);
		});
	});
});
