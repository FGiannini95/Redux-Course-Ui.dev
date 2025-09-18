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
{
  type: ADD_TODO;
  todo: {
    id: 0;
    name: "Learn Redux";
    complete: false;
  }
}

{
  type: REMOVE_TODO;
  id: 0;
}

{
  type: TOGGLE_TODO;
  id: 0;
}

{
  type: ADD_GOAL;
  goal: {
    id: 0;
    name: "Run a Marathon";
  }
}

{
  type: REMOVE_GOAL;
  id: 0;
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
