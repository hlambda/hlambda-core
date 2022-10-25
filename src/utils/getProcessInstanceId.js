import { v4 as uuidv4 } from 'uuid';

let processInstanceId;

const getProcessInstanceId = async () => {
  if (typeof processInstanceId === 'string') {
    return processInstanceId;
  }
  processInstanceId = uuidv4();
  return processInstanceId;
};

export default getProcessInstanceId;
