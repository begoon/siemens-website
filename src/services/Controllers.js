import request from './Fetch';

// const host = "http://127.0.0.1:5000";
const host = "https://siemens-controller.herokuapp.com";

export const saveVariable = (controller, name, value, complete, always, failed) => {
  if (!name) return;
  const path = `controller/${controller}/variable/set?${name}=${value}`
  request(host, path, complete, always, failed);
}

export const deleteVariable = (controller, name, complete, always, failed) => {
  const path = `controller/${controller}/variable/delete?${name}`
  request(host, path, complete, always, failed);
}

export const createController = (name, complete, always, failed) => {
  request(host, `controller/${name}/create`, complete, always, failed);
}

export const deleteController = (name, complete, always, failed) => {
  request(host, `controller/${name}/delete`, complete, always, failed);
}

export const loadControllers = (complete, always, failed) => {
  request(host, `controller`, complete, always, failed);
}

export const readStatus = (complete, always, failed) => {
  request(host, `status`, complete, always, failed);
}
