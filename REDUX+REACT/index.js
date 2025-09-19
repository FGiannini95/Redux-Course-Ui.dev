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
const RECEIVE_DATA = "RECEIVE_DATA";

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

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
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
    case RECEIVE_DATA:
      return action.todos;
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
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}

// Middleware function
// next = or the next Middleware in the Middleware chain or the dispatch function
const checker = (store) => (next) => (action) => {
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

  return next(action);
};

// Middleware function
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log("The action: ", action);
  const result = next(action);
  console.log("The new state: ", store.getState());
  console.groupEnd();

  return result;
};

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
  }),
  Redux.applyMiddleware(checker, logger)
);

function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

window.store = store;
