const List = () => {
  return (
    <ul>
      <li>List</li>
    </ul>
  );
};

const Todos = () => {
  return (
    <div>
      TODOS
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

function App() {
  return (
    <div>
      <Todos />
      <Goals />
    </div>
  );
}

window.App = App;
