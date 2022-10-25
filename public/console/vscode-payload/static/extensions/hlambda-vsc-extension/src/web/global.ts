interface GlobalReferenceType {
	storageManager: any;
	clientAPI: any;
	remoteRESTFS: any;
	memFs: any;
}

export const globalReference: GlobalReferenceType = {
	storageManager: null,
	clientAPI: null,
	remoteRESTFS: null,
	memFs: null,
};

export default globalReference;
