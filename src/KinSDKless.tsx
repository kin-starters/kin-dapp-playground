import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Wallet from './SolanaWallets';

import { MakeToast, getTransactions, openExplorer } from './helpers';
import { handleSendKin, HandleSendKin } from './helpers/SDKless/handleSendKin';
import { handleCreateTokenAccount } from './helpers/SDKless/handleCreateTokenAccount';
import { handleCloseEmptyTokenAccount } from './helpers/SDKless/handleCloseEmptyTokenAccount';
import {
  handleGetKinBalances,
  Balance,
} from './helpers/SDKless/handleGetKinBalances';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import './Kin.scss';

interface KinSDKlessAppProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  solanaNetwork: string;
}
function KinSDKlessApp({
  makeToast,
  setLoading,
  solanaNetwork,
}: KinSDKlessAppProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  // Transfer Kin EbYNd2MjmhdVLoffL1SiTYFJuxorAbs7urN2pYCbfpg1
  const [payToUser, setPayToUser] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Spend');
  const [memo, setMemo] = useState('');

  // Create Kin Token Account
  const [
    createTokenAccountSolanaWallet,
    setCreateTokenAccountSolanaWallet,
  ] = useState('');

  // Close Kin Token Account
  const [
    closeEmptyTokenAccountSolanaWallet,
    setCloseEmptyTokenAccountSolanaWallet,
  ] = useState('');
  useEffect(() => {
    if (publicKey) {
      setCloseEmptyTokenAccountSolanaWallet(publicKey.toBase58());
    } else {
      setCloseEmptyTokenAccountSolanaWallet('');
    }
  }, [publicKey]);

  // Balances
  const [balanceAddress, setBalanceAddress] = useState('');
  const [balances, setBalances] = useState<Balance[] | null>(null);

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
      <h3 className="Kin-section">
        {`Make payments and earn Kin via the KRE`}
      </h3>

      <KinAction
        title="Transfer Kin - Build and send transactions directly on Solana"
        subTitle="You'll need some SOL in your account to cover transaction fees"
        links={kinLinks.SDKlessCodeSamples.methods.submitPayment}
        actions={[
          {
            name: 'Transfer',
            disabledAction: !publicKey || !payToUser,
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
        links={kinLinks.SDKlessCodeSamples.methods.createAccount}
        actions={[
          {
            name: 'Create',
            disabledAction: !publicKey || !createTokenAccountSolanaWallet,
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
          {
            name: 'View in Explorer',
            disabledAction: !createTokenAccountSolanaWallet,
            onClick: () => {
              openExplorer({
                address: createTokenAccountSolanaWallet,
                solanaNetwork,
              });
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
      <br />
      <hr />
      <h3 className="Kin-section">{`Additional Kin Related Actions`}</h3>
      <KinAction
        title="View Balance"
        subTitle="See how much Kin is in the Token Accounts for a Solana Wallet"
        links={kinLinks.SDKlessCodeSamples.methods.getBalance}
        disabled={!balanceAddress}
        actions={[
          {
            name: 'Get Balance',
            onClick: () => {
              setLoading(true);
              setBalances(null);
              handleGetKinBalances({
                connection,
                address: balanceAddress,
                solanaNetwork,

                onSuccess: (data: Balance[]) => {
                  setBalances(data);
                  setLoading(false);
                },
                onFailure: () => {
                  setLoading(false);
                  makeToast({
                    text: "Couldn't get balances...",
                    happy: false,
                  });
                },
              });
            },
          },
          {
            name: 'View in Explorer',
            onClick: () => {
              openExplorer({ address: balanceAddress, solanaNetwork });
            },
          },
        ]}
        inputs={[
          {
            name: 'Solana Wallet Address',
            value: balanceAddress,
            onChange: setBalanceAddress,
          },
        ]}
        displayOutput={balances && { balances }}
      />
      <KinAction
        title="Close your Empty Kin Token Account"
        subTitle="Reclaim rent for your own account when it has a zero balance"
        subTitleLinks={kinLinks.solanaRent}
        links={kinLinks.SDKlessCodeSamples.methods.closeEmptyTokenAccount}
        actions={[
          {
            name: 'Close Account',
            disabledAction: !publicKey,
            onClick: () => {
              if (publicKey) {
                setLoading(true);
                handleCloseEmptyTokenAccount({
                  connection,
                  sendTransaction,
                  to: closeEmptyTokenAccountSolanaWallet,
                  solanaNetwork,
                  onSuccess: () => {
                    setLoading(false);
                    makeToast({
                      text: 'Token Account Successfully Closed!',
                      happy: true,
                    });
                    setShouldUpdate(true);
                    setCreateTokenAccountSolanaWallet('');
                  },
                  onFailure: () => {
                    setLoading(false);
                    makeToast({
                      text: 'Token Account Closing Failed!',
                      happy: false,
                    });
                  },
                });
              } else {
                makeToast({
                  text: 'Token Account Closing Failed!',
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
            disabledInput: true,
          },
        ]}
      />
      <KinAction
        title="View Transaction Details"
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

interface KinSDKlessAppWithWalletProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  solanaNetwork: string;
  setSolanaNetwork: (network: string) => void;
}
export function KinSDKlessAppWithWallet({
  makeToast,
  setLoading,
  solanaNetwork,
  setSolanaNetwork,
}: KinSDKlessAppWithWalletProps) {
  return (
    <div className="Kin">
      <h4 className="Kin-section">
        {`Create and send transactions directly on Solana`}
        <br />
        {`Use a Solana Wallet to sign your transactions (e.g. Phantom, Solflare, etc)`}
        <br />
        <br />
        {`SDK-less bypasses `}
        <Links links={kinLinks.agora} />
        {` so you'll have to subsidise your transactions with SOL but you can still take advantage of the Kin Rewards Engine`}
        <br />
        <br />
        <Links links={kinLinks.SDKless} />
        <br />
        <Links links={kinLinks.KRE} />
      </h4>
      <KinAction
        open
        title="Set your Solana Network then Connect to a Wallet"
        subTitle="Make sure your wallet is connected to the same network  | Make sure you've registered your App on the Kin Developer Portal | Remember to add your environment variable for your App Index"
        subTitleLinks={kinLinks.devPortal}
        inputs={[
          {
            name: 'Network',
            value: solanaNetwork,
            options: [
              'Mainnet',
              // 'Testnet',
              'Devnet',
            ],
            onChange: setSolanaNetwork,
          },
        ]}
      />

      <h4 className="Kin-section">{`Connect to Solana Wallet`}</h4>
      <p className="KRELinks">
        <Links links={kinLinks.walletAdapter} darkMode />
      </p>
      <Wallet solanaNetwork={solanaNetwork}>
        <KinSDKlessApp
          makeToast={makeToast}
          setLoading={setLoading}
          solanaNetwork={solanaNetwork}
        />
      </Wallet>
    </div>
  );
}
