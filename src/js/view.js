import { v4 as uuidv4 } from 'uuid';
import icons from 'url:../img/icons.svg';

class View {
  #todoForm = document.querySelector('.todo-input-container');
  #todoListContainer = document.querySelector('.app-list-container');
  #todoInput = document.querySelector('.todo-input');
  #todoDate = document.querySelector('.todo-date');
  #appDate = document.querySelector('.app-date');
  #appError = document.querySelector('.app-error');
  #todoList;

  constructor() {
    this.#appDate.innerHTML = this._displayDate(new Date());
  }

  addHandlerForm(handler) {
    if (!this.#todoForm) return;
    this.#todoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  addHandlerList(handler) {
    if (!this.#todoListContainer) return;
    this.#todoListContainer.addEventListener('click', function (e) {
      handler(e);
    });
  }

  renderTodoList(state) {
    this.#todoListContainer.innerHTML = '';

    if (state.length < 1) {
      this.#todoListContainer.insertAdjacentHTML('afterbegin', '<span>No todos yet :(</span>');
    }

    const sections = [...new Set(state.map(el => el.date))];
    sections.sort((a, b) => new Date(b) - new Date(a)).push(sections[0]);
    sections.splice(0, 1);

    sections.forEach(section => this._createTodoSection(section));

    const todoListSections = document.querySelectorAll('.app-list-section');
    const todoListSectionDates = [];
    todoListSections.forEach(s => todoListSectionDates.push(s.dataset.date));
    this.#todoList = document.querySelectorAll('.app-list');

    state.forEach(el => {
      const index = todoListSectionDates.findIndex(i => i === el.date);
      const html = this._createTodoElement(el);

      this.#todoList[index].insertAdjacentHTML('beforeend', html);
    });
  }

  createTodo(state) {
    if (!this.#todoInput.value) {
      this._displayError('Input is empty');
      return;
    }

    if (this.#todoDate.valueAsDate < new Date() && this.#todoDate.valueAsDate) {
      this._displayError('Invalid date');
      return;
    }

    const element = {
      id: uuidv4(),
      description: this.#todoInput.value,
      completed: false,
      date: this.#todoDate.value ? this.#todoDate.valueAsDate.toString() : '',
    };

    state.push(element);
    this.#todoInput.value = '';
    this.#todoDate.value = '';
  }

  deleteTodo(element, state) {
    const todoElement = element.closest('li');
    const todoId = todoElement.dataset.id;

    const stateElement = state.findIndex(el => todoId === el.id);
    state.splice(stateElement, 1);
  }

  checkTodo(element, state) {
    const todoElement = element.closest('li');
    const todoId = todoElement.dataset.id;

    const stateElement = state.find(el => todoId === el.id);
    stateElement.completed = !stateElement.completed;
  }

  _createTodoSection(data) {
    const section = `
        <div class="app-list-section" data-date="${data}">
          <div class="todo-section-date">${this._displayDate(data)}</div>
          <ul class="app-list">
          </ul>
        </div>
    `;

    this.#todoListContainer.insertAdjacentHTML('afterbegin', section);
  }

  _createTodoElement(element) {
    return `
      <li data-id="${element.id}" class="${element.completed ? 'completed' : ''}">
          <input type="checkbox" class="todo-completed-btn" />
          <div class="todo-completed-checkbox">&check;</div>
          <div class="todo-info">
            <p class="todo-text">${element.description}</p>
            <p class="todo-element-date">${this._displayDate(element.date)}</p>
          </div>
          <div>
            <div class="todo-buttons">
                <button class="todo-delete-btn">
                    <svg>
                        <use href="${icons}#delete"></use>
                    </svg>
                </button>
            </div>
          </div>
      </li>
      `;
  }

  _displayDate(date) {
    if (!date) return '';

    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    return formattedDate;
  }

  _displayError(input) {
    this.#appError.innerHTML = input;
    this.#appError.classList.remove('hidden');

    setTimeout(() => {
      this.#appError.classList.add('hidden');
      this.#appError.innerHTML = '';
    }, 3000);
  }
}

export default new View();
