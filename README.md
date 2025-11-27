<div align="center">
    <img src="[https://i.imgur.com/KVVR2dM.png](https://i.imgur.com/KVVR2dM.png)">
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
// Output example: 27/11/2025 10:00:00 | MY-APP | 8520 | [BOOT] System started successfully

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
