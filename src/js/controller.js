import * as model from './model.js';
import view from './view.js';

const controlTodoForm = function () {
  view.createTodo(model.state);
  model.setState();
  view.renderTodoList(model.state);
};

const controlTodoList = function (e) {
  const deleteBtn = e.target.closest('.todo-delete-btn');
  const checkbox = e.target.closest('.todo-completed-btn');

  if (deleteBtn) view.deleteTodo(deleteBtn, model.state);
  if (checkbox) view.checkTodo(checkbox, model.state);

  model.setState();
  view.renderTodoList(model.state);
};

const init = function () {
  model.getState();
  view.renderTodoList(model.state);
  view.addHandlerForm(controlTodoForm);
  view.addHandlerList(controlTodoList);
};

init();
