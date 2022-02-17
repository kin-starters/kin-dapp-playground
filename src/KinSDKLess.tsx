import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import { Wallet, handleSendKin, HandleSendKin } from './kinSDKLessHelpers';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import {
  MakeToast,
  //  openExplorer
} from './helpers';

import './Kin.scss';

interface KinSDKLessAppProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  solanaEnvironment: string;
}
function KinSDKLessApp({
  makeToast,
  setLoading,
  solanaEnvironment,
}: KinSDKLessAppProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [payToUser, setPayToUser] = useState(
    'EbYNd2MjmhdVLoffL1SiTYFJuxorAbs7urN2pYCbfpg1'
  );
  const [amount, setAmount] = useState('100');
  const [type, setType] = useState('Spend');
  const [memo, setMemo] = useState('');

  return (
    <div>
      <div
        className={`Kin-status ${
          connection && publicKey ? 'hasAppIndex' : 'noAppIndex'
        }`}
      >
        {connection && publicKey ? (
          <span>
            {`Connected to Wallet`}
            <br />
            {`App Index ${process.env.REACT_APP_APP_INDEX} on on ${solanaEnvironment}`}
          </span>
        ) : (
          <span>
            {`Client Not Initialised`}
            <br />
            {`Click Setup Below`}
          </span>
        )}
      </div>
      <br />
      <hr />
      <h4 className="Kin-section">{`Make payments and earn Kin via the KRE`}</h4>
      <p className="KRELinks">
        <Links links={kinLinks.KRE} darkMode />
      </p>{' '}
      <KinAction
        title="Transfer Kin"
        linksTitle={kinLinks.clientCodeSamples.title}
        links={kinLinks.clientCodeSamples.methods.submitPayment}
        actions={[
          {
            name: 'Send',
            onClick: () => {
              setLoading(true);

              if (publicKey && amount) {
                const sendKinOptions: HandleSendKin = {
                  connection,
                  sendTransaction,
                  from: publicKey,
                  to: payToUser,
                  amount,
                  memo,
                  type,
                  solanaEnvironment,
                  onSuccess: () => {
                    setLoading(false);
                    makeToast({ text: 'Send Successful!', happy: true });
                    setAmount('');
                    setMemo('');
                  },
                  onFailure: () => {
                    setLoading(false);
                    makeToast({ text: 'Send Failed!', happy: false });
                  },
                };
                handleSendKin(sendKinOptions);
              } else {
                makeToast({ text: 'Send Failed!', happy: false });
                setLoading(false);
              }
            },
          },
        ]}
        inputs={[
          {
            name: 'To',
            value: payToUser,
            onChange: setPayToUser,
          },
          {
            name: 'Amount to Transfer',
            value: amount,
            type: 'number',
            onChange: setAmount,
          },
          {
            name: 'Transaction Type',
            value: type,
            options: ['Spend', 'Earn', 'P2P'],
          },
          { name: 'Memo', value: memo, onChange: setMemo },
        ]}
      />
    </div>
  );
}

interface KinSDKLessAppWithWalletProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  solanaEnvironment: string;
  setSolanaEnvironment: (environment: string) => void;
}
export function KinSDKLessAppWithWallet({
  makeToast,
  setLoading,
  solanaEnvironment,
  setSolanaEnvironment,
}: KinSDKLessAppWithWalletProps) {
  return (
    <div className="Kin">
      <KinAction
        open
        title="Set your Solana Environment"
        inputs={[
          {
            name: 'Environment',
            value: solanaEnvironment,
            options: ['Mainnet', 'Testnet', 'Devnet'],
            onChange: setSolanaEnvironment,
          },
        ]}
      />
      <br />
      <hr />
      <h4 className="Kin-section">{`Connect to Solana Wallet`}</h4>
      <p className="KRELinks">
        <Links links={kinLinks.walletAdapter} darkMode />
      </p>
      <Wallet solanaEnvironment={solanaEnvironment}>
        <KinSDKLessApp
          makeToast={makeToast}
          setLoading={setLoading}
          solanaEnvironment={solanaEnvironment}
        />
      </Wallet>
    </div>
  );
}
