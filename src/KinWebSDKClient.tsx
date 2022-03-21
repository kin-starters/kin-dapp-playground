import { useState, useEffect } from 'react';
import { KinClient, Wallet } from '@kin-sdk/client';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import {
  MakeToast,
  openExplorer,
  getUserAccounts,
  getUserAccount,
  getTransactions,
  getPublicKey,
} from './helpers';

import { handleSetUpKinClient } from './helpers/webSDK/handleSetUpKinClient';
import { handleCreateAccount } from './helpers/webSDK/handleCreateAccount';
import { handleGetBalance } from './helpers/webSDK/handleGetBalance';
import { handleRequestAirdrop } from './helpers/webSDK/handleRequestAirdrop';
import { handleSendKin, HandleSendKin } from './helpers/webSDK/handleSendKin';

import './Kin.scss';

interface KinClientAppProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  kinClient: KinClient | null;
  setKinClient: (client: KinClient) => void;
  kinClientNetwork: string;
  setKinClientNetwork: (network: string) => void;
}
export function KinClientApp({
  makeToast,
  setLoading,
  kinClient,
  setKinClient,
  kinClientNetwork,
  setKinClientNetwork,
}: KinClientAppProps) {
  const [userAccounts, setUserAccounts] = useState<string[]>(
    getUserAccounts(kinClientNetwork)
  );
  const [transactions, setTransactions] = useState<string[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (shouldUpdate) {
      // Get data from secure local storage
      setUserAccounts(getUserAccounts(kinClientNetwork));
      setTransactions(getTransactions());

      setShouldUpdate(false);
    }
  }, [shouldUpdate]);
  const [kinNetwork, setKinNetwork] = useState('Test');

  const [newUserName, setNewUserName] = useState('');

  const [balanceUser, setBalanceUser] = useState('');
  const [displayBalance, setDisplayBalance] = useState('');

  const [airdropUser, setAirdropUser] = useState('');
  const [airdropAmount, setAirdropAmount] = useState('');

  const [payFromUserP2P, setPayFromUserP2P] = useState('');
  const [payToUserP2P, setPayToUserP2P] = useState('');
  const [payAmountP2P, setPayAmountP2P] = useState('');

  const [inputTransaction, setInputTransaction] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');

  const [seeWallet, setSeeWallet] = useState('');

  const [seeWalletDetails, setSeeWalletDetails] = useState<Wallet | null>(null);

  return (
    <div className="Kin">
      <h4 className="Kin-section">
        {`Create and send transactions via the Kin Web SDK`}
        <br />
        <br />
        <Links links={kinLinks.webSDK} />
        <br />
        <br />
        {`Transactions made via Kin SDKs use `}
        <Links links={kinLinks.agora} />
        {` so you can easily take advantage of the Kin Rewards Engine, get subisided transactions, etc`}
        <br />
        <br />
        <Links links={kinLinks.KRE} />
      </h4>
      <div className={`Kin-status ${kinClient ? 'hasAppIndex' : 'noAppIndex'}`}>
        {kinClient ? (
          <span>
            {`Client Initialised`}
            <br />
            {`App Index ${process.env.REACT_APP_APP_INDEX} on ${kinClientNetwork}`}
          </span>
        ) : (
          <span>
            {`Client Not Initialised`}
            <br />
            {`Click Setup Below`}
          </span>
        )}
      </div>

      <KinAction
        open
        title="Initialise Your Kin Client with your App Index"
        subTitle="Make sure you've registered your App on the Kin Developer Portal | Remember to add your environment variable for your App Index"
        subTitleLinks={kinLinks.devPortal}
        links={kinLinks.clientCodeSamples.methods.setUpKinClient}
        disabled={!process.env.REACT_APP_APP_INDEX}
        actions={[
          {
            name: 'Setup',
            onClick: () => {
              handleSetUpKinClient({
                kinNetwork,
                onSuccess: ({ client }) => {
                  setKinClient(client);
                  setKinClientNetwork(kinNetwork);
                  setShouldUpdate(true);
                  makeToast({
                    text: 'Client Initialisation Successful!',
                    happy: true,
                  });
                },
                onFailure: () => {
                  makeToast({
                    text: 'Client Initialisation Failed!',
                    happy: false,
                  });
                },
              });
            },
          },
        ]}
        inputs={[
          {
            name: 'Network',
            value: kinNetwork,
            options: ['Test', 'Prod'],
            onChange: setKinNetwork,
          },
        ]}
      />

      {kinClient ? (
        <>
          <br />
          <hr />
          <h3 className="Kin-section">{`Manage Kin Accounts`}</h3>
          <KinAction
            title="Create a Kin Account for a User"
            links={kinLinks.clientCodeSamples.methods.createAccount}
            actions={[
              {
                name: 'Create',
                onClick: () => {
                  const exists = userAccounts.includes(newUserName);
                  if (exists) {
                    makeToast({
                      text: 'Username already exists',
                      happy: false,
                    });
                  } else {
                    setLoading(true);
                    handleCreateAccount({
                      kinClient,
                      name: newUserName,
                      kinNetwork: kinClientNetwork,
                      onSuccess: () => {
                        setLoading(false);
                        makeToast({
                          text: 'Account Creation Successful!',
                          happy: true,
                        });
                        setShouldUpdate(true);
                        setNewUserName('');
                      },
                      onFailure: () => {
                        setLoading(false);
                        makeToast({
                          text: 'Account Creation Failed!',
                          happy: false,
                        });
                      },
                    });
                  }
                },
              },
            ]}
            inputs={[
              {
                name: 'Username',
                value: newUserName,
                onChange: setNewUserName,
              },
            ]}
          />{' '}
          <KinAction
            title="Get an Account Balance"
            links={kinLinks.clientCodeSamples.methods.getBalance}
            disabled={!userAccounts.length}
            actions={[
              {
                name: 'Get Balance',
                onClick: () => {
                  setLoading(true);
                  handleGetBalance({
                    kinClient,
                    user: balanceUser || userAccounts[0],
                    kinNetwork: kinClientNetwork,
                    onSuccess: (balance) => {
                      setLoading(false);
                      setDisplayBalance(balance);
                    },
                    onFailure: () => {
                      setLoading(false);
                      makeToast({
                        text: "Couldn't get Balance!",
                        happy: false,
                      });
                    },
                  });
                },
              },
              {
                name: 'See in Explorer',
                onClick: () => {
                  const address = getPublicKey(
                    balanceUser || userAccounts[0],
                    kinClientNetwork
                  );
                  if (!address) {
                    makeToast({
                      text: "Couldn't find user's address",
                      happy: false,
                    });
                  } else {
                    openExplorer({
                      address,
                      kinNetwork,
                    });
                  }
                },
              },
            ]}
            inputs={[
              {
                name: 'User',
                value: balanceUser,
                options: userAccounts,
                onChange: (user) => {
                  setBalanceUser(user);
                  setDisplayBalance('');
                },
              },
            ]}
            displayValue={
              displayBalance
                ? `${balanceUser || userAccounts[0]} has ${displayBalance} Kin`
                : ''
            }
          />
          <br />
          <hr />
          <h3 className="Kin-section">{`Make payments and earn Kin via the KRE`}</h3>
          {(() => {
            if (!userAccounts || userAccounts.length < 2) {
              return <h4>Why not add some users?</h4>;
            }

            return null;
          })()}
          {kinNetwork === 'Test' ? (
            <KinAction
              title="Request Airdrop (Test Network Only)"
              subTitle="Get some kin so you can start testing your transaction code"
              links={kinLinks.clientCodeSamples.methods.requestAirdrop}
              disabled={!userAccounts.length || !airdropAmount}
              actions={[
                {
                  name: 'Request',
                  onClick: () => {
                    setLoading(true);
                    handleRequestAirdrop({
                      to: airdropUser || userAccounts[0],
                      amount: airdropAmount,
                      kinClient,
                      kinNetwork: kinClientNetwork,
                      onSuccess: () => {
                        setLoading(false);
                        makeToast({ text: 'Airdrop Successful!', happy: true });
                        setShouldUpdate(true);
                        setAirdropAmount('');
                      },
                      onFailure: () => {
                        setLoading(false);
                        makeToast({ text: 'Airdrop Failed!', happy: false });
                      },
                    });
                  },
                },
              ]}
              inputs={[
                {
                  name: 'User',
                  value: airdropUser,
                  options: userAccounts,
                  disabledInput: !userAccounts[0],
                  onChange: (user) => {
                    setAirdropUser(user);
                  },
                },
                {
                  name: 'Requested Amount',
                  value: airdropAmount,
                  type: 'number',
                  disabledInput: !userAccounts[0],
                  onChange: setAirdropAmount,
                },
              ]}
            />
          ) : null}
          <KinAction
            title="Send Kin from User to User -  P2P Transaction"
            links={kinLinks.clientCodeSamples.methods.submitPayment}
            subTitle="If you've added a Transactions Webhook URL on the Kin Developer Portal, make sure your server is running so that it can validate this transaction."
            subTitleLinks={kinLinks.webhooks}
            actions={[
              {
                name: 'Send',
                onClick: () => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    kinClient,
                    kinNetwork: kinClientNetwork,
                    from: payFromUserP2P || userAccounts[0],
                    to: payToUserP2P || userAccounts[1],
                    amount: payAmountP2P,
                    type: 'P2P',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountP2P('');
                      setShouldUpdate(true);
                    },
                    onFailure: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                    },
                  };

                  if (
                    sendKinOptions.from &&
                    sendKinOptions.to &&
                    sendKinOptions.from !== sendKinOptions.to &&
                    payAmountP2P
                  ) {
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
                name: 'From',
                value: payFromUserP2P || userAccounts[0],
                options: userAccounts,
                disabledInput: !userAccounts[1],
                onChange: (user) => {
                  setPayFromUserP2P(user);
                },
              },
              {
                name: 'To',
                value: payToUserP2P || userAccounts[1],
                options: userAccounts,
                disabledInput: !userAccounts[1],
                onChange: (user) => {
                  setPayToUserP2P(user);
                },
              },
              {
                name: 'Amount to Send',
                value: payAmountP2P,
                type: 'number',
                disabledInput: !userAccounts[1],
                onChange: setPayAmountP2P,
              },
            ]}
            disabled={!payAmountP2P || !userAccounts[1]}
          />
          <br />
          <hr />
          <h3 className="Kin-section">{`Additional actions not using Kin SDK`}</h3>
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
                  openExplorer({ transaction, kinNetwork });
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
                disabledInput:
                  !transactions.length || !!inputTransaction.length,
              },
            ]}
          />
          <KinAction
            title="View User Keys"
            subTitle="Users will need a safe way to access their secret so they don't lose access to their Kin"
            disabled={!userAccounts[0]}
            actions={[
              {
                name: 'View',
                onClick: () => {
                  const wallet = getUserAccount(
                    seeWallet || userAccounts[0],
                    kinClientNetwork
                  );
                  setSeeWalletDetails(wallet);
                },
              },
            ]}
            inputs={[
              {
                name: 'User',
                value: seeWallet || userAccounts[0],
                options: [...userAccounts],
                onChange: (user) => {
                  setSeeWallet(user);
                  setSeeWalletDetails(null);
                },
                disabledInput: !userAccounts.length,
              },
            ]}
            displayOutput={seeWalletDetails ? seeWalletDetails : null}
          />
          <br />
          <hr />
        </>
      ) : null}
    </div>
  );
}
