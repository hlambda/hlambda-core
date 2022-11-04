/*
	HASURA CLINET
*/
const createAPIClient = (baseUrl: string, secret: string, authType = 'secret') => {
	/*
        Triggers server restart.
    */
	const getSchemaIntrospection = async (): Promise<String | undefined> => {
		console.log(`Calling: ${baseUrl}/console/api/v1/trigger-restart`);
		const response = await fetch(`${baseUrl}/console/api/v1/trigger-restart`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hasura-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}
		return undefined;
	};

	const getCustomActions = async (): Promise<String | undefined> => {
		console.log(`Calling: ${baseUrl}/console/api/v1/trigger-restart`);
		const response = await fetch(`${baseUrl}/console/api/v1/trigger-restart`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-Hasura-Admin-Secret': secret,
			},
		});

		let resultRequestText = await response.text();
		if (response.ok) {
			return resultRequestText;
		}
		return undefined;
	};

	return {
		getSchemaIntrospection,
	};
};

export default createAPIClient;
