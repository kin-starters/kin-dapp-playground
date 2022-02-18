import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  Wallet,
  handleSendKin,
  HandleSendKin,
  handleCreateTokenAccount,
  handleCloseEmptyTokenAccount,
} from './kinSDKLessHelpers';
import { MakeToast, getTransactions, openExplorer } from './helpers';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import './Kin.scss';

interface KinSDKLessAppProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  solanaNetwork: string;
}
function KinSDKLessApp({
  makeToast,
  setLoading,
  solanaNetwork,
}: KinSDKLessAppProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Transfer Kin
  const [payToUser, setPayToUser] = useState(
    'EbYNd2MjmhdVLoffL1SiTYFJuxorAbs7urN2pYCbfpg1'
  );
  const [amount, setAmount] = useState('100');
  const [type, setType] = useState('Spend');
  const [memo, setMemo] = useState('');

  // Create Kin Token Account
  const [
    createTokenAccountSolanaWallet,
    setCreateTokenAccountSolanaWallet,
  ] = useState('');

  // Garbage Collect Kin Token Account
  const [
    closeEmptyTokenAccountSolanaWallet,
    setCloseEmptyTokenAccountSolanaWallet,
  ] = useState('');

  // Transactions
  const [transactions, setTransactions] = useState<string[]>(getTransactions());
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (shouldUpdate) {
      // Get data from secure local storage
      setTransactions(getTransactions());
      setShouldUpdate(false);
    }
  }, [shouldUpdate]);
  const [inputTransaction, setInputTransaction] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');

  return (
    <div>
      <div
        className={`Kin-status ${
          connection && publicKey && process.env.REACT_APP_APP_INDEX
            ? 'hasAppIndex'
            : 'noAppIndex'
        }`}
      >
        {connection && publicKey ? (
          <span>{`Connected to Wallet`}</span>
        ) : (
          <span>{`Wallet not Connected`}</span>
        )}
        <span>
          <br />
          {`App Index ${process.env.REACT_APP_APP_INDEX} on ${solanaNetwork}`}
        </span>
      </div>
      <br />
      <hr />
      <h4 className="Kin-section">{`Make payments and earn Kin via the KRE`}</h4>
      <p className="KRELinks">
        <Links links={kinLinks.KRE} darkMode />
      </p>{' '}
      <KinAction
        title="Transfer Kin - Build and send transactions directly on Solana"
        subTitle="You'll need some SOL in your account to cover transaction fees"
        linksTitle={kinLinks.clientCodeSamples.title}
        links={kinLinks.SDKLessCodeSamples.methods.submitPayment}
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
                  solanaNetwork,
                  onSuccess: () => {
                    setShouldUpdate(true);
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
            onChange: setType,
          },
          { name: 'Memo', value: memo, onChange: setMemo },
        ]}
      />
      <KinAction
        title="Subsidise Creating a Kin Token Account for a Solana Wallet"
        subTitle="You can't send Kin to a Solana wallet without a Kin Token Account"
        linksTitle={kinLinks.serverCodeSamples.title}
        links={kinLinks.serverCodeSamples.methods.createAccount}
        actions={[
          {
            name: 'Create',
            onClick: () => {
              if (publicKey) {
                setLoading(true);
                handleCreateTokenAccount({
                  connection,
                  sendTransaction,
                  from: publicKey,
                  to: createTokenAccountSolanaWallet,
                  solanaNetwork,
                  onSuccess: () => {
                    setLoading(false);
                    makeToast({
                      text: 'Token Account Creation Successful!',
                      happy: true,
                    });
                    setShouldUpdate(true);
                    setCreateTokenAccountSolanaWallet('');
                  },
                  onFailure: () => {
                    setLoading(false);
                    makeToast({
                      text: 'Token Account Creation Failed!',
                      happy: false,
                    });
                  },
                });
              } else {
                makeToast({
                  text: 'Token Account Creation Failed!',
                  happy: false,
                });
                setLoading(false);
              }
            },
          },
        ]}
        inputs={[
          {
            name: 'Solana Wallet',
            value: createTokenAccountSolanaWallet,
            onChange: setCreateTokenAccountSolanaWallet,
          },
        ]}
      />
      <KinAction
        title="Garbage Collect Empty Kin Token Accounts"
        subTitle="Reclaim your fees???"
        linksTitle={kinLinks.serverCodeSamples.title}
        links={kinLinks.serverCodeSamples.methods.createAccount}
        actions={[
          {
            name: 'Close Account',
            onClick: () => {
              if (publicKey) {
                setLoading(true);
                handleCloseEmptyTokenAccount({
                  connection,
                  sendTransaction,
                  from: publicKey,
                  to: closeEmptyTokenAccountSolanaWallet,
                  solanaNetwork,
                  onSuccess: () => {
                    setLoading(false);
                    makeToast({
                      text: 'Token Account Creation Successful!',
                      happy: true,
                    });
                    setShouldUpdate(true);
                    setCreateTokenAccountSolanaWallet('');
                  },
                  onFailure: () => {
                    setLoading(false);
                    makeToast({
                      text: 'Token Account Creation Failed!',
                      happy: false,
                    });
                  },
                });
              } else {
                makeToast({
                  text: 'Token Account Creation Failed!',
                  happy: false,
                });
                setLoading(false);
              }
            },
          },
        ]}
        inputs={[
          {
            name: 'Solana Wallet',
            value: closeEmptyTokenAccountSolanaWallet,
            onChange: setCloseEmptyTokenAccountSolanaWallet,
          },
        ]}
      />
      <KinAction
        title="View Transaction"
        subTitle="See the details of your transactions on the Solana Explorer"
        disabled={!transactions.length && !inputTransaction}
        actions={[
          {
            name: 'View',
            onClick: () => {
              const transaction =
                inputTransaction || selectedTransaction || transactions[0];
              openExplorer({ transaction, solanaNetwork });
            },
          },
        ]}
        inputs={[
          {
            name: 'Transaction Id',
            value: inputTransaction,
            onChange: (transaction) => {
              setInputTransaction(transaction);
            },
          },
          {
            name: 'Transaction',
            value: selectedTransaction || transactions[0],
            options: [...transactions],
            onChange: (transaction) => {
              setSelectedTransaction(transaction);
              setInputTransaction('');
            },
            disabledInput: !transactions.length || !!inputTransaction.length,
          },
        ]}
      />
    </div>
  );
}

interface KinSDKLessAppWithWalletProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  solanaNetwork: string;
  setSolanaEnvironment: (environment: string) => void;
}
export function KinSDKLessAppWithWallet({
  makeToast,
  setLoading,
  solanaNetwork,
  setSolanaEnvironment,
}: KinSDKLessAppWithWalletProps) {
  return (
    <div className="Kin">
      <h4 className="Kin-section">
        {`Create and send transactions directly on Solana`}
        <br />
        {`Use a Solana Wallet to sign your transactions (e.g. Phantom, Solflare, etc)`}
      </h4>
      <h4 className="Kin-section"></h4>
      <KinAction
        open
        title="Set your Solana Network"
        subTitle="Make sure your wallet is connected to the same network"
        inputs={[
          {
            name: 'Environment',
            value: solanaNetwork,
            options: ['Mainnet', 'Testnet', 'Devnet'],
            onChange: setSolanaEnvironment,
          },
        ]}
      />
      <h4 className="Kin-section">{`Connect to Solana Wallet`}</h4>
      <p className="KRELinks">
        <Links links={kinLinks.walletAdapter} darkMode />
      </p>
      <Wallet solanaNetwork={solanaNetwork}>
        <KinSDKLessApp
          makeToast={makeToast}
          setLoading={setLoading}
          solanaNetwork={solanaNetwork}
        />
      </Wallet>
    </div>
  );
}
