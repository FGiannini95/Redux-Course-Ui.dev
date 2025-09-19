const List = ({ items, remove, toggle }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <span
            onClick={() => toggle && toggle(item.id)}
            style={{ textDecoration: item.complete ? "line-through" : "none" }}
          >
            {item.name}
          </span>
          <button onClick={() => remove(item)}>X</button>
        </li>
      ))}
    </ul>
  );
};

const Todos = ({ store, todos }) => {
  const inputRef = React.useRef(null);
  const addItem = (e) => {
    e.preventDefault();
    const name = inputRef.current.value.trim();
    inputRef.current.value = "";

    store.dispatch(
      window.addTodoAction({
        id: window.generateId(),
        name,
        complete: false,
      })
    );
  };

  const removeItem = (todo) => {
    store.dispatch(removeTodoAction(todo.id));
  };

  const toggleItem = (id) => {
    store.dispatch(toggleTodoAction(id));
  };

  return (
    <div>
      <h1>Todo List with React</h1>
      <input type="text" placeholder="Add Todo with React" ref={inputRef} />
      <button onClick={addItem}>Add Todo with React</button>
      <List items={todos} remove={removeItem} toggle={toggleItem} />
    </div>
  );
};

const Goals = ({ store, goals }) => {
  const inputRef = React.useRef(null);
  const addItem = (e) => {
    e.preventDefault();
    const name = inputRef.current.value.trim();
    inputRef.current.value = "";

    store.dispatch(
      addGoalAction({
        id: window.generateId(),
        name,
      })
    );
  };

  const removeItem = (goal) => {
    store.dispatch(removeGoalAction(goal.id));
  };

  return (
    <div>
      <h1>Goal List with React</h1>
      <input type="text" placeholder="Add Goal with React" ref={inputRef} />
      <button onClick={addItem}>Add Todo with React</button>
      <List items={goals} remove={removeItem} />
    </div>
  );
};

function AppReact({ store }) {
  // Force a re-render on store updates (no new libs)
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  // Subscribe on mount, unscribe on unmount
  React.useEffect(() => {
    const unsubscribe = store.subscribe(forceRender);
    return unsubscribe;
  }, [store]);

  const { todos, goals, loading } = store.getState();

  Promise.all([API.fetchTodos(), API.fetchGoals()]).then(([todos, goals]) => {
    store.dispatch(receiveDataAction(todos, goals));
  });

  if (loading) return <h3>Loading...</h3>;

  return (
    <div>
      <Todos store={store} todos={todos} />
      <Goals store={store} goals={goals} />
    </div>
  );
}

window.AppReact = AppReact;
