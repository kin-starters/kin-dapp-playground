import { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import { colors, kinLinks } from './constants';
import { MakeToast } from './helpers';

import logo from './kin-white.svg';
import { Toggle } from './Toggle';
import { KinServerApp } from './KinServer';
import { KinClientApp } from './KinClient';
import { Links } from './Links';

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

  const appTypes = ['Server App', 'Client App'];
  const [selectedAppType, setSelectedAppType] = useState(appTypes[1]);

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

      <nav className="App-nav">
        <div className="App-nav-container">
          <div className="App-logo-container">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <span>SDK Demo</span>
          <span>
            <Links links={kinLinks.docs} />
          </span>
        </div>
      </nav>
      <main className="App-body">
        <div className="App-body-container">
          <Toggle
            title="I'm making a ..."
            options={appTypes}
            selected={selectedAppType}
            onChange={setSelectedAppType}
          />

          {selectedAppType === appTypes[0] ? (
            <KinServerApp makeToast={makeToast} setLoading={setLoading} />
          ) : (
            <KinClientApp makeToast={makeToast} setLoading={setLoading} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
