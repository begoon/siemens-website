import $ from 'jquery';

// const host = "http://127.0.0.1:5000";
const host = "https://siemens-controller.herokuapp.com";

const request = (url, complete, always, failed) => {
  const path = host + "/" + url;
  $.get(path,
    (response) => {
      if (complete) complete(response);
    })
    .always(() => {
      if (always) always();
    })
    .fail(() => {
      if (failed) failed(path);
    });
}

export const saveVariable = (controller, name, value, complete, always, failed) => {
  if (!name) return;
  const path = `controller/${controller}/variable/set?${name}=${value}`
  request(path, complete, always, failed);
}

export const deleteVariable = (controller, name, complete, always, failed) => {
  const path = `controller/${controller}/variable/delete?${name}`
  request(path, complete, always, failed);
}

export const createController = (name, complete, always, failed) => {
  request(`controller/${name}/create`, complete, always, failed);
}

export const deleteController = (name, complete, always, failed) => {
  request(`controller/${name}/delete`, complete, always, failed);
}

export const loadControllers = (complete, always, failed) => {
  request(`controller`, complete, always, failed);
}
