// Library code, we really don't implemnt it, but we instally via npm
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

  // When we create the store we invoke getState, subscribe and dispatch
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

// Differents type of events that can eventually change the state of the store
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

// With two reducer we want the following shape for our state (to get that structure we create the combineReducers function):
/*
{
  todos:[],
  goals:[],
}
*/

// Reducer function. We use state = {} to avoid undefined values
function combineReducers(state = {}, action) {
  return {
    todos: todos(state.todos, action), // Pass the slice of the state tree they care about
    goals: goals(state.goals, action), // Pass the slice of the state tree they care about
  };
}

const store = createStore(combineReducers);

store.subscribe(() => {
  console.log("The new state is: ", store.getState());

  const { todos, goals } = store.getState();
  console.log("todos", todos);
  console.log("goals", goals);

  // Reset element in order to avoid duplication in the Ui
  document.getElementById("goals").innerHTML = "";
  document.getElementById("todos").innerHTML = "";

  todos.forEach(addTodoToDom);
  goals.forEach(addGoalToDOM);
});

function addTodoToDom(todo) {
  const node = document.createElement("li");
  const text = document.createTextNode(todo.name);
  node.appendChild(text);

  // Adjust the style depending on the status
  node.style.textDecoration = todo.complete ? "line-through" : "none";
  node.addEventListener("click", () => {
    store.dispatch(toggleTodoAction(todo.id));
  });

  document.getElementById("todos").appendChild(node);
}

function addGoalToDOM(goal) {
  const node = document.createElement("li");
  const text = document.createTextNode(goal.name);
  node.appendChild(text);

  document.getElementById("goals").appendChild(node);
}

/*
store.dispatch(
  addTodoAction({
    id: 0,
    name: "Walk the dog",
    complete: false,
  })
);

store.dispatch(
  addTodoAction({
    id: 1,
    name: "Wash the car",
    complete: false,
  })
);

store.dispatch(
  addTodoAction({
    id: 2,
    name: "Go to the gym",
    complete: true,
  })
);

store.dispatch(removeTodoAction(1));

store.dispatch(toggleTodoAction(0));

store.dispatch(
  addGoalAction({
    id: 0,
    name: "Learn Redux",
  })
);

store.dispatch(
  addGoalAction({
    id: 1,
    name: "Lose 20 pounds",
  })
);

store.dispatch(removeGoalAction(0));
*/

// DOM code
function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

function addTodo() {
  // grab the input field and dispatch an action
  const input = document.getElementById("todo");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addTodoAction({
      id: generateId(),
      name,
      complete: false,
    })
  );
}

function addGoal() {
  const input = document.getElementById("goal");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addGoalAction({
      id: generateId(),
      name,
    })
  );
}

document.getElementById("todoBtn").addEventListener("click", addTodo);
document.getElementById("goalBtn").addEventListener("click", addGoal);
