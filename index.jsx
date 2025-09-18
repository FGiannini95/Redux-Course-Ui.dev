/* index.jsx
   Boot the app using React 18's createRoot with global React/ReactDOM.
   App is exposed on window by components/App.jsx (no imports in this setup).
*/

const rootEl = document.getElementById("root");

const root = ReactDOM.createRoot(rootEl);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
