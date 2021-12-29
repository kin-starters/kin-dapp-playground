import logo from './kin.svg';
import Kin from './Kin'
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Node SDK Demo

        </p>
        <a
          className="App-link"
          href="https://developer.kin.org/tutorials/node/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kin Docs
        </a>
      </header>
      <main className="App-body">
        <Kin />
      </main>
    </div>
  );
}

export default App;
