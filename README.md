<div align="center">
    <img src="https://i.imgur.com/KVVR2dM.png">
</div>

## ZyroHub - Utilities

<p>Utility functions and helpers by the ZyroHub ecosystem, designed to streamline development and enhance productivity.</p>

## Table of Contents

- [ZyroHub - Utilities](#zyrohub---utilities)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
- [Utilities](#utilities)
    - [Terminal](#terminal)
    - [Ansi / Colors](#ansi--colors)
    - [Time](#time)
    - [FileSystem](#filesystem)
    - [Validator](#validator)

## Getting Started

To install the utilities package, use one of the following package managers:

[NPM Repository](https://www.npmjs.com/package/@zyrohub/utilities)

```bash
# npm
npm install @zyrohub/utilities
# yarn
yarn add @zyrohub/utilities
# pnpm
pnpm add @zyrohub/utilities
# bun
bun add @zyrohub/utilities
```

## Utilities

### Terminal

A terminal service for beautifully formatted console outputs with timestamps, package names, and process IDs.

```typescript
import { Terminal } from '@zyrohub/utilities';

// Standard logging methods with predefined colors
Terminal.success('BOOT', 'System started successfully');
// Output example: 27/11 10:00:00 | MY-APP | 8520 | [BOOT] System started successfully

Terminal.error('DB', ['Connection failed:', errorObject]);
Terminal.info('USER', 'User logged in');
Terminal.warn('MEM', 'High memory usage detected');
```

**Custom Logging**

You can use the `log` method to define a custom flag and its color using the `Ansi` utility.

```typescript
import { Terminal, Ansi } from '@zyrohub/utilities';

// Terminal.log(flag, colorFunction, content)
Terminal.log('CRON', Ansi.magenta, 'Scheduled task executed.');
Terminal.log('DEBUG', Ansi.gray, ['Variable state:', { a: 1, b: 2 }]);
```

---

### Ansi / Colors

A zero-dependency, type-safe ANSI formatter. It supports standard colors, bright variants, backgrounds, and text styles. It handles style nesting correctly and respects environment variables.

**Basic Usage**

```typescript
import { Ansi } from '@zyrohub/utilities';

console.log(Ansi.red('This is red text'));
console.log(Ansi.bgBlue(Ansi.white('White text on blue background')));
```

**Style Composition & Nesting**

The `Ansi` utility intelligently handles nested styles, ensuring inner styles don't break the outer formatting.

```typescript
// Complex composition
const message = Ansi.bold(`Error: ${Ansi.red('File not found')} in ${Ansi.underline('src/index.ts')}`);

console.log(message);
```

**Available Methods**

All methods are static and available directly from the `Ansi` class.

| Category          | Methods                                                                                                              |
| :---------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Colors**        | `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`                                        |
| **Bright Colors** | `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`               |
| **Backgrounds**   | `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`, `bgGray`                      |
| **Bright BGs**    | `bgBrightRed`, `bgBrightGreen`, `bgBrightYellow`, `bgBrightBlue`, `bgBrightMagenta`, `bgBrightCyan`, `bgBrightWhite` |
| **Styles**        | `bold`, `dim`, `italic`, `underline`, `blink`, `reverse`, `strikethrough`                                            |

**Environment Variables**

The utility automatically detects if colors should be disabled based on the environment:

- `NO_COLOR`: If present, all coloring is disabled.
- `FORCE_COLOR`: Forces color output even in non-TTY environments.
- `TERM`: Checks for `dumb` terminals.

**Exposed Constants**

For advanced use cases, you can access the raw ANSI maps and environment status directly.

- `ANSI_CODES`: Map containing all raw opening ANSI codes.
- `ANSI_CLOSE_CODES`: Map containing all raw closing ANSI codes.
- `isEnvColorsAllowed`: Boolean indicating if color output is currently enabled.

```typescript
import { ANSI_CODES, ANSI_CLOSE_CODES, isEnvColorsAllowed } from '@zyrohub/utilities';

if (isEnvColorsAllowed) {
	console.log(`${ANSI_CODES.red}Manual Red Text${ANSI_CODES.reset}`);
}
```

---

### Time

A utility for time manipulation and formatting.

**Duration Formatting**

Formats milliseconds into readable strings, automatically scaling to seconds (`s`) or minutes (`m`).

```typescript
import { Time } from '@zyrohub/utilities';

console.log(Time.duration(500)); // "500ms"
console.log(Time.duration(1500)); // "1.5s"
console.log(Time.duration(90000)); // "1.5m"
```

**Sleep**

Promise-based delay function to pause execution.

```typescript
import { Time } from '@zyrohub/utilities';

await Time.sleep(1000); // Pauses execution for 1 second
```

---

### FileSystem

A utility for file system operations.

**Load Folder**

Recursively loads files from a specified folder with options to filter and ignore certain files or folders.

```typescript
import { FileSystem } from '@zyrohub/utilities';

const files = await FileSystem.loadFolder(
	'/path/to/folder',
	{
		recursive: true, // Load files recursively (default: true)
		auto_import: true, // Automatically import files (default: true)
		auto_default: true, // Automatically use default export if available (default: true)
		filter_files: [/\.ts$/, /\.js$/], // Only include .ts and .js files (optional) (accepts strings and regex)
		filter_folders: ['src', 'lib'], // Only include these folders on recursive (optional) (accepts strings and regex)
		ignore_files: ['.env'], // Ignore these files (optional) (accepts strings and regex)
		ignore_folders: ['node_modules', '.git'] // Ignore these folders (optional) (accepts strings and regex)
	},
	// A callback for all files loaded
	files => {
		console.log('All files loaded!', files);
	},
	// A callback for each file loaded
	file => {
		console.log('File loaded!', file);
	}
);
```

### Validator

A utility for schema validation using Zod, Yup, or class-validator.

**Validate**

Validates data against a provided schema.

```typescript
import { Validator } from '@zyrohub/utilities';
import z from 'zod';

// Zod schema
const userSchema = z.object({
	name: z.string(),
	age: z.number().min(0)
});

const userData = { name: 'Alice', age: 30 };

const validatedData = await Validator.validate(userSchema, userData);
console.log(validatedData); // { success: true, data: { name: 'Alice', age: 30 } }
```
