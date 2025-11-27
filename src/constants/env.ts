import process from 'node:process';

export const isEnvColorsAllowed =
	!process.env.NO_COLOR && (process.env.FORCE_COLOR || (process.stdout.isTTY && process.env.TERM !== 'dumb'));

export default { isEnvColorsAllowed };
