import { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import { colors } from './constants';
import { MakeToast } from './helpers';

import logo from './kin.svg';
import Kin from './Kin';

import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

const makeToast = ({ text, happy }: MakeToast) => {
  const options = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  return happy ? toast.success(text, options) : toast.error(text, options);
};

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <ToastContainer />
      {loading ? (
        <div className="LoaderFullScreen">
          <Loader
            type="Audio"
            color={colors.kin_light}
            height={100}
            width={100}
          />
        </div>
      ) : null}

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Node SDK Demo</p>
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
        <Kin makeToast={makeToast} setLoading={setLoading} />
      </main>
    </div>
  );
}

export default App;
