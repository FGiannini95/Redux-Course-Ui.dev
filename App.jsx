const List = () => {
  return (
    <ul>
      <li>List</li>
    </ul>
  );
};

const Todos = ({ store }) => {
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
      <h1>To List with React</h1>
      <input type="text" placeholder="Add Todo with React" ref={inputRef} />
      <button onClick={addItem}>Add Todo with React</button>
      <List />
    </div>
  );
};

const Goals = () => {
  return (
    <div>
      GOALS
      <List />
    </div>
  );
};

function App({ store }) {
  return (
    <div>
      <Todos store={store} />
      <Goals />
    </div>
  );
}

window.App = App;
