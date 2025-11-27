export class Time {
	static duration(ms: number): string {
		if (ms < 1000) {
			return `${Math.round(ms)}ms`;
		}

		if (ms < 60000) {
			const seconds = ms / 1000;
			return `${parseFloat(seconds.toFixed(2))}s`;
		}

		const minutes = ms / 60000;
		return `${parseFloat(minutes.toFixed(2))}m`;
	}

	static sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

export default { Time };
