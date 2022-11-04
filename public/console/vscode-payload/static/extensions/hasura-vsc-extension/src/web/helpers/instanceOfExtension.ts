import { v4 as uuidv4 } from 'uuid';

export let instanceOfExtension: string | null = '';

export const setInstanceOfExtension = (_instanceOfExtension?: string | null | undefined): void => {
	if (_instanceOfExtension) {
		instanceOfExtension = _instanceOfExtension;
	} else {
		instanceOfExtension = uuidv4().slice(-8);
	}
};

export const getInstanceOfExtension = (): string => {
	if (!instanceOfExtension) {
		throw new Error('Extension does not have instance id!');
	}

	return instanceOfExtension;
};
