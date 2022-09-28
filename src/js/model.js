export let state = [];

export const setState = function () {
  localStorage.setItem('todos', JSON.stringify(state));
};

export const getState = function () {
  const storage = localStorage.getItem('todos');
  if (storage) state = JSON.parse(storage);
};
