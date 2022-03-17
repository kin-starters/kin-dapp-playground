import { useState } from 'react';
import { KinClient } from '@kin-sdk/client';

import { ToastContainer, toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import { colors, kinLinks } from './constants';
import { MakeToast } from './helpers';

import logo from './kin-white.svg';
import { Toggle } from './Toggle';
import { KinServerApp } from './KinServer';
import { KinClientApp } from './KinWebSDKClient';
import { KinSDKlessAppWithWallet } from './KinSDKlessClient';

import { Links } from './Links';

import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { SolanaNetwork } from './@kin-tools/kin-transaction';

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

  const appTypes = [
    'Backend Server - Kin SDK',
    'DApp - Kin Web SDK',
    'DApp - SDK-less',
  ];
  const [selectedAppType, setSelectedAppType] = useState(appTypes[0]);

  const [kinClient, setKinClient] = useState<KinClient | null>(null);
  const [kinClientNetwork, setKinClientNetwork] = useState('Test');
  const [solanaNetwork, setSolanaNetwork] = useState<SolanaNetwork>('Mainnet');

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
          <span>DApp Playground</span>
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

          {(() => {
            if (selectedAppType === appTypes[0]) {
              return (
                <KinServerApp makeToast={makeToast} setLoading={setLoading} />
              );
            }
            if (selectedAppType === appTypes[1]) {
              return (
                <KinClientApp
                  makeToast={makeToast}
                  setLoading={setLoading}
                  kinClient={kinClient}
                  setKinClient={setKinClient}
                  kinClientNetwork={kinClientNetwork}
                  setKinClientNetwork={setKinClientNetwork}
                />
              );
            }
            if (selectedAppType === appTypes[2]) {
              return (
                <KinSDKlessAppWithWallet
                  makeToast={makeToast}
                  setLoading={setLoading}
                  solanaNetwork={solanaNetwork}
                  setSolanaNetwork={setSolanaNetwork}
                />
              );
            }

            return null;
          })()}
        </div>
      </main>
    </div>
  );
}

export default App;
