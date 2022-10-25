import { v4 as uuidv4 } from 'uuid';

export const createInstance = (_instance?: string | null | undefined) => {
	let instance: string | null = '';

	if (_instance) {
		instance = _instance;
	} else {
		instance = uuidv4();
	}

	const setInstance = (_instance?: string | null | undefined): void => {
		if (_instance) {
			instance = _instance;
		} else {
			instance = uuidv4();
		}
	};

	const getInstance = (): string => {
		if (!instance) {
			throw new Error('Instance id is not set!');
		}
		return instance;
	};

	return {
		instance,
		setInstance,
		getInstance,
	};
};
