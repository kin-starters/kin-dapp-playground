import { useState, useEffect } from 'react';
import { KinClient, Wallet } from '@kin-sdk/client';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import { MakeToast, openExplorer } from './helpers';
import {
  handleSetupKinClient,
  handleCreateAccount,
  handleGetBalance,
  handleRequestAirdrop,
  handleSendKin,
  HandleSendKin,
  getUserAccounts,
  getUserWallet,
  getTransactions,
  getPublicKey,
} from './kinClientHelpers';

import './Kin.scss';

interface KinClientAppProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
  kinClient: KinClient | null;
  setKinClient: (client: KinClient) => void;
  kinClientAppIndex: number | null;
  setKinClientAppIndex: (kinClientAppIndex: number) => void;
}
export function KinClientApp({
  makeToast,
  setLoading,
  kinClient,
  setKinClient,
  kinClientAppIndex,
  setKinClientAppIndex,
}: KinClientAppProps) {
  const [userAccounts, setUserAccounts] = useState<string[]>(getUserAccounts());
  const [transactions, setTransactions] = useState<string[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (shouldUpdate) {
      // Get data from secure local storage
      setUserAccounts(getUserAccounts());
      setTransactions(getTransactions());

      setShouldUpdate(false);
    }
  }, [shouldUpdate]);
  const [kinEnvironment, setKinEnvironment] = useState('Test');
  const [appIndex, setAppIndex] = useState(
    kinClientAppIndex ? kinClientAppIndex.toString() : ''
  );

  const [newUserName, setNewUserName] = useState('');

  const [balanceUser, setBalanceUser] = useState('App');
  const [displayBalance, setDisplayBalance] = useState('');

  const [airdropUser, setAirdropUser] = useState('App');
  const [airdropAmount, setAirdropAmount] = useState('');

  const [payFromUserP2P, setPayFromUserP2P] = useState('');
  const [payToUserP2P, setPayToUserP2P] = useState('');
  const [payAmountP2P, setPayAmountP2P] = useState('');

  const [payFromUserSpend, setPayFromUserSpend] = useState('');
  const [payAmountSpend, setPayAmountSpend] = useState('');

  const [payToUserEarn, setPayToUserEarn] = useState('');
  const [payAmountEarn, setPayAmountEarn] = useState('');

  const [inputTransaction, setInputTransaction] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');

  const [seeWallet, setSeeWallet] = useState('');

  const [seeWalletDetails, setSeeWalletDetails] = useState<Wallet | null>(null);

  return (
    <div className="Kin">
      <div
        className={`Kin-status ${
          kinClientAppIndex ? 'hasAppIndex' : 'noAppIndex'
        }`}
      >
        <span>
          {`Client Initialised`}
          <br />
          {`App Index ${kinClientAppIndex}`}
        </span>
      </div>

      <KinAction
        open
        title="Initialise Your Kin Client with your App Index"
        subTitleLinks={kinLinks.devPortal}
        linksTitle={kinLinks.title}
        links={kinLinks.setupClient}
        actions={[
          {
            name: 'Setup',
            onClick: () => {
              const { client, appIndex: newAppIndex } = handleSetupKinClient({
                kinEnvironment,
                appIndex: Number(appIndex),
              });
              setKinClient(client);
              setKinClientAppIndex(newAppIndex);
            },
          },
        ]}
        inputs={[
          {
            name: 'Environment',
            value: kinEnvironment,
            options: ['Test', 'Prod'],
            onChange: setKinEnvironment,
          },
          {
            name: 'App Index',
            value: appIndex,
            type: 'number',
            onChange: setAppIndex,
          },
        ]}
        disabled={!appIndex}
      />

      {kinClient ? (
        <>
          <br />
          <hr />

          <h4 className="Kin-section">{`SDK Actions that don't require registering your App Index:`}</h4>

          {/* TODO Refacto action to be an array */}
          <KinAction
            title="Get Account Balance"
            linksTitle={kinLinks.title}
            links={kinLinks.getBalance}
            actions={[
              {
                name: 'Get Balance',
                onClick: () => {
                  setLoading(true);
                  handleGetBalance({
                    kinClient,
                    user: balanceUser,
                    onSuccess: (balance) => {
                      setLoading(false);
                      setDisplayBalance(balance);
                    },
                    onFailure: (error) => {
                      setLoading(false);
                      console.log(error);
                    },
                  });
                },
              },
              {
                name: 'See in Explorer',
                onClick: () => {
                  openExplorer({
                    address: getPublicKey(balanceUser),
                    kinEnvironment,
                  });
                },
              },
            ]}
            inputs={[
              {
                name: 'User',
                value: balanceUser,
                options: ['App', ...userAccounts],
                onChange: (user) => {
                  setBalanceUser(user);
                  setDisplayBalance('');
                },
              },
            ]}
            displayValue={
              displayBalance ? `${balanceUser} has ${displayBalance} Kin` : ''
            }
          />

          {kinEnvironment === 'Test' ? (
            <KinAction
              title="Request Airdrop (Test Network Only)"
              subTitle="Get some kin so you can start testing your transaction code"
              linksTitle={kinLinks.title}
              links={kinLinks.requestAirdrop}
              actions={[
                {
                  name: 'Request',
                  onClick: () => {
                    setLoading(true);
                    handleRequestAirdrop({
                      to: airdropUser,
                      amount: airdropAmount,
                      kinClient,
                      onSuccess: () => {
                        setLoading(false);
                        makeToast({ text: 'Airdrop Successful!', happy: true });
                        setShouldUpdate(true);
                        setAirdropAmount('');
                      },
                      onFailure: (error) => {
                        setLoading(false);
                        makeToast({ text: 'Airdrop Failed!', happy: false });
                        console.log(error);
                      },
                    });
                  },
                },
              ]}
              inputs={[
                {
                  name: 'User',
                  value: airdropUser,
                  options: ['App', ...userAccounts],
                  onChange: (user) => {
                    setAirdropUser(user);
                  },
                },
                {
                  name: 'Requested Amount',
                  value: airdropAmount,
                  type: 'number',
                  onChange: setAirdropAmount,
                },
              ]}
            />
          ) : null}

          <br />
          <hr />

          <h4 className="Kin-section">{`These SDK Actions require registering your App Index so you can take advantage of the KRE:`}</h4>
          <p className="KRELinks">
            <Links links={kinLinks.KRE} darkMode />
          </p>

          {(() => {
            if (!kinClientAppIndex && !userAccounts.length) {
              return (
                <h4>Why not register your App Index and add some users?</h4>
              );
            }
            if (!kinClientAppIndex) {
              return <h4>Why not register your App Index?</h4>;
            }
            if (!userAccounts.length) {
              return <h4>Why not add some usersz?</h4>;
            }

            return null;
          })()}

          <KinAction
            title="Create a Kin Account for your User"
            linksTitle={kinLinks.title}
            links={kinLinks.createAccount}
            actions={[
              {
                name: 'Create',
                onClick: () => {
                  setLoading(true);
                  handleCreateAccount({
                    kinClient,
                    name: newUserName,
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({
                        text: 'Account Creation Successful!',
                        happy: true,
                      });
                      setShouldUpdate(true);
                      setNewUserName('');
                    },
                    onFailure: (error) => {
                      setLoading(false);
                      makeToast({
                        text: 'Account Creation Failed!',
                        happy: false,
                      });
                      console.log(error);
                    },
                  });
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
          />

          <KinAction
            title="Pay Kin from App To User - Earn Transaction"
            linksTitle={kinLinks.title}
            links={kinLinks.submitPayment}
            actions={[
              {
                name: 'Pay',
                onClick: () => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    kinClient,
                    from: 'App',
                    to: payToUserEarn || userAccounts[0],
                    amount: payAmountEarn,

                    type: 'Earn',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountEarn('');

                      setShouldUpdate(true);
                    },
                    onFailure: (error: string) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  };

                  handleSendKin(sendKinOptions);
                },
              },
            ]}
            inputs={[
              {
                name: 'To',
                value: payToUserEarn || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayToUserEarn(user);
                },
              },
              {
                name: 'Amount to Pay',
                value: payAmountEarn,
                type: 'number',
                onChange: setPayAmountEarn,
              },
            ]}
            disabled={!kinClientAppIndex}
          />
          <KinAction
            title="Pay Kin from User To App - Spend Transaction"
            linksTitle={kinLinks.title}
            links={kinLinks.submitPayment}
            subTitle="Requires 'sign_transaction' Webhook"
            actions={[
              {
                name: 'Pay',
                onClick: () => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    kinClient,
                    from: payFromUserSpend || userAccounts[0],
                    to: 'App',
                    amount: payAmountSpend,
                    type: 'Spend',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountSpend('');
                      setShouldUpdate(true);
                    },
                    onFailure: (error: string) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  };

                  handleSendKin(sendKinOptions);
                },
              },
            ]}
            inputs={[
              {
                name: 'From',
                value: payFromUserSpend || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayFromUserSpend(user);
                },
              },
              {
                name: 'Amount to Pay',
                value: payAmountSpend,
                type: 'number',
                onChange: setPayAmountSpend,
              },
            ]}
            disabled={!kinClientAppIndex}
          />
          <KinAction
            title="Send Kin from User to User -  P2P Transaction"
            linksTitle={kinLinks.title}
            links={kinLinks.submitPayment}
            subTitle="Requires 'sign_transaction' Webhook"
            actions={[
              {
                name: 'Send',
                onClick: () => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    kinClient,
                    from: payFromUserP2P || userAccounts[0],
                    to: payToUserP2P || userAccounts[0],
                    amount: payAmountP2P,
                    type: 'P2P',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountP2P('');
                      setShouldUpdate(true);
                    },
                    onFailure: (error: string) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  };

                  handleSendKin(sendKinOptions);
                },
              },
            ]}
            inputs={[
              {
                name: 'From',
                value: payFromUserP2P || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayFromUserP2P(user);
                },
              },
              {
                name: 'To',
                value: payToUserP2P || userAccounts[0],
                options: userAccounts,
                onChange: (user) => {
                  setPayToUserP2P(user);
                },
              },
              {
                name: 'Amount to Send',
                value: payAmountP2P,
                type: 'number',
                onChange: setPayAmountP2P,
              },
            ]}
            disabled={!kinClientAppIndex || payFromUserP2P === payToUserP2P}
          />
          <br />
          <hr />

          <h4 className="Kin-section">{`Additional actions not using Kin SDK`}</h4>

          <KinAction
            title="View Transaction"
            subTitle="See the details of your transactions on the Solana Explorer"
            actions={[
              {
                name: 'View',
                onClick: () => {
                  const transaction =
                    inputTransaction || selectedTransaction || transactions[0];
                  openExplorer({ transaction, kinEnvironment });
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
                  const wallet = getUserWallet(seeWallet || userAccounts[0]);
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
