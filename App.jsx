const List = ({ item }) => {
  return (
    <ul>
      {item.map((item) => (
        <li key={item.id}>
          <span>{item.name}</span>
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

  return (
    <div>
      <h1>Todo List with React</h1>
      <input type="text" placeholder="Add Todo with React" ref={inputRef} />
      <button onClick={addItem}>Add Todo with React</button>
      <List item={todos} />
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

  return (
    <div>
      <h1>Goal List with React</h1>
      <input type="text" placeholder="Add Goal with React" ref={inputRef} />
      <button onClick={addItem}>Add Todo with React</button>
      <List item={goals} />
    </div>
  );
};

function App({ store }) {
  // Force a re-render on store updates (no new libs)
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  // Subscribe on mount, unscribe on unmount
  React.useEffect(() => {
    const unsubscribe = store.subscribe(forceRender);
    return unsubscribe;
  }, [store]);

  const { todos, goals } = store.getState();

  return (
    <div>
      <Todos store={store} todos={todos} />
      <Goals store={store} goals={goals} />
    </div>
  );
}

window.App = App;
