// Library code
// We really don't implemnt it, but we instally via npm (Redux.createStore fn below, does the same). Is is just for learning purpouse.
function createStore(reducer) {
  // The store should have 4 parts:
  // 1. The state
  let state;

  // 2. Get the state
  const getState = () => state;

  // 3. Listen to changes on the state
  let listeners = []; // listeneres = array of funcionts
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      // unsubscribe
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  // 4. Update the state => dispatch the action
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  // When we create the store we return an object with three function: getState, subscribe and dispatch
  return {
    getState,
    subscribe,
    dispatch,
  };
}

// App code
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

// Action creators = object representation of events that can occur in the application and eventually change the state of our store
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

// Reducer function. We use state = [] to avoid undefined values
function todos(state = [], action) {
  // Reducer generally handle lots of case, switch statement is better than if/else block
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]);
    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id
          ? todo
          : // Object.assign allow to merge differents objects together =>
            // -create a brand new Object
            // -merge all the properties of todo object into the new empty object
            // -asign a new vale to the complete property
            Object.assign({}, todo, { complete: !todo.complete })
      );
    default:
      return state;
  }
}

// Reducer function. We use state = [] to avoid undefined values
function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);
    default:
      return state;
  }
}

// Reducer function
function checkAndDispatch(store, action) {
  // Todo section
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().indexOf("bitcoin") !== -1
  ) {
    return alert("Nope. That's a bad idea.");
  }

  // Goal section
  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().indexOf("bitcoin") !== -1
  ) {
    return alert("Nope. That's a bad idea.");
  }

  return store.dispatch(action);
}

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
  })
);

store.subscribe(() => {
  const { todos, goals } = store.getState();

  // Reset element in order to avoid duplication in the Ui
  document.getElementById("goals").innerHTML = "";
  document.getElementById("todos").innerHTML = "";

  todos.forEach(addTodoToDom);
  goals.forEach(addGoalToDOM);
});

// DOM code
// We take the state from our store and update the Ui, displaying or removing items

function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

// Change the state
function addTodo() {
  // grab the input field and dispatch an action
  const input = document.getElementById("todo");
  const name = input.value;
  input.value = "";

  checkAndDispatch(
    store,
    addTodoAction({
      id: generateId(),
      name,
      complete: false,
    })
  );
}
// Change the state
function addGoal() {
  const input = document.getElementById("goal");
  const name = input.value;
  input.value = "";

  store.checkAndDispatch(
    store,
    addGoalAction({
      id: generateId(),
      name,
    })
  );
}

function createRemoveButton(onClick) {
  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = "X";
  removeBtn.addEventListener("click", onClick);

  return removeBtn;
}

// Render the new state
function addTodoToDom(todo) {
  // Create the Todo item
  const node = document.createElement("li");
  const text = document.createTextNode(todo.name);

  // Create the remove button
  const removeBtn = createRemoveButton(() => {
    checkAndDispatch(store, removeTodoAction(todo.id));
  });

  // Render in the Ui the newest elements
  node.appendChild(text);
  node.appendChild(removeBtn);

  // Adjust the style depending on the status
  node.style.textDecoration = todo.complete ? "line-through" : "none";

  node.addEventListener("click", () => {
    checkAndDispatch(store, toggleTodoAction(todo.id));
  });

  document.getElementById("todos").appendChild(node);
}

// Render the new state
function addGoalToDOM(goal) {
  // Create the Goal item
  const node = document.createElement("li");
  const text = document.createTextNode(goal.name);

  // Create the remove button
  const removeBtn = createRemoveButton(() => {
    checkAndDispatch(store, removeGoalAction(goal.id));
  });

  // Render in the Ui the newest elements
  node.appendChild(text);
  node.appendChild(removeBtn);

  document.getElementById("goals").appendChild(node);
}

document.getElementById("todoBtn").addEventListener("click", addTodo);
document.getElementById("goalBtn").addEventListener("click", addGoal);
