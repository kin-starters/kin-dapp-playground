import { useState, useEffect } from 'react';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import { MakeToast, openExplorer } from './helpers';
import {
  getServerStatus,
  handleSetUpKinClient,
  handleCreateAccount,
  handleGetBalance,
  handleRequestAirdrop,
  handleSendKin,
  handleGetTransaction,
  Transaction,
  User,
  HandleSendKin,
} from './helpers/serverSDK';

import './Kin.scss';

interface KinServerAppProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
}
export function KinServerApp({ makeToast, setLoading }: KinServerAppProps) {
  const [serverRunning, setServerRunning] = useState(false);
  const [serverAppIndex, setServerAppIndex] = useState(0);
  const [serverKinNetwork, setServerKinNetwork] = useState<string | null>(null);

  const [userAccounts, setUserAccounts] = useState<User[]>([]);
  const userAccountNames = userAccounts
    .map((userAccount) => userAccount.name)
    .filter((userName) => userName !== 'App');

  const [transactions, setTransactions] = useState<string[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (shouldUpdate) {
      setLoading(true);
      getServerStatus({
        onSuccess: ({ status, data }) => {
          if (data?.env === 1) setServerKinNetwork('Test');
          if (data?.env === 0) setServerKinNetwork('Prod');

          setServerAppIndex(data.appIndex);
          setUserAccounts(data.users);
          setTransactions(data.transactions);
          if (!serverRunning)
            makeToast({
              text: `Server Running!`,
              happy: true,
            });

          setServerRunning(status === 200);
          setLoading(false);
          setShouldUpdate(false);
        },
        onFailure: () => {
          setServerRunning(false);
          setShouldUpdate(false);
          setServerAppIndex(0);
          setServerKinNetwork(null);
          setLoading(false);
          makeToast({
            text: `Can't find Server!`,
            happy: false,
          });
        },
      });
    }

    return () => {};
  }, [shouldUpdate]);
  const [kinNetwork, setKinNetwork] = useState('Test');

  const [newUserName, setNewUserName] = useState('');

  const [balanceUser, setBalanceUser] = useState('App');
  const [displayBalance, setDisplayBalance] = useState('');

  const [airdropUser, setAirdropUser] = useState('App');
  const [airdropAmount, setAirdropAmount] = useState('');

  const [inputTransaction, setInputTransaction] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [gotTransaction, setGotTransaction] = useState<Transaction | null>(
    null
  );

  const [payFromUserP2P, setPayFromUserP2P] = useState(
    userAccountNames[0] || ''
  );
  const [payToUserP2P, setPayToUserP2P] = useState(userAccountNames[1] || '');
  const [payAmountP2P, setPayAmountP2P] = useState('');

  const [payFromUserSpend, setPayFromUserSpend] = useState('');
  const [payAmountSpend, setPayAmountSpend] = useState('');

  const [payToUserEarn, setPayToUserEarn] = useState('');
  const [payAmountEarn, setPayAmountEarn] = useState('');

  return (
    <div className="Kin">
      <h4 className="Kin-section">
        {`Create and send transactions via a Kin Server SDK`}
        <br />
        <br />
        <span>
          <Links links={kinLinks.serverSDKRepos} linksTitle="Server SDKs: " />
          <br />
          <Links
            links={kinLinks.serverSDKTutorials}
            linksTitle="Server SDK Tutorials: "
          />
          <br />
          <Links links={kinLinks.demoServers} linksTitle="Demo Servers: " />
          <br />
          {`Coming soon: Python, Go`}
        </span>
        <br />
        <br />
        {`Transactions made via Kin SDKs use `}
        <Links links={kinLinks.agora} />
        {` so you can easily take advantage of the Kin Rewards Engine, get subisided transactions, etc`}
        <br />
        <br />
        <Links links={kinLinks.KRE} />
      </h4>
      <div
        className={`Kin-status ${
          serverRunning && serverAppIndex ? 'up' : 'down'
        }`}
      >
        {serverRunning && serverAppIndex ? (
          <span>
            Server Running{' '}
            {serverAppIndex ? (
              <>
                <br />
                App Index {serverAppIndex} on {serverKinNetwork}
              </>
            ) : (
              <>
                <br />
                <span>
                  {`Register on the Kin Developer Portal to get your App Index`}
                </span>
              </>
            )}
          </span>
        ) : (
          <span>
            {!serverRunning
              ? `Can't connect to server`
              : `Server running but Kin Client not initialised`}
            <br />

            {!serverRunning ? (
              <span>
                <br />
                {`Make sure you're running your server on the port you set in your .env file`}
                <br />
                {`Checkout the README for details`}
              </span>
            ) : (
              ''
            )}
          </span>
        )}
      </div>

      <KinAction
        open
        title="Server Check"
        subTitle="Check again if your server is running"
        actions={[
          {
            name: 'Check',
            onClick: () => {
              setServerRunning(false);
              setServerAppIndex(0);
              setServerKinNetwork(null);
              setLoading(true);
              setTimeout(() => {
                setShouldUpdate(true);
              }, 1000);
            },
          },
        ]}
      />

      {serverRunning ? (
        <>
          <KinAction
            open
            title="Initialise your Kin Client on the Server"
            subTitle="Choose your environment"
            subTitleLinks={kinLinks.devPortal}
            linksTitle={kinLinks.serverCodeSamples.title}
            links={kinLinks.serverCodeSamples.methods.setUpKinClient}
            actions={[
              {
                name: 'Setup',
                onClick: () => {
                  setLoading(true);
                  handleSetUpKinClient({
                    onSuccess: () => {
                      setLoading(false);
                      setShouldUpdate(true);
                      makeToast({
                        text: `Kin Client initialised!`,
                        happy: true,
                      });
                    },
                    onFailure: () => {
                      setLoading(false);
                      setShouldUpdate(true);
                      makeToast({
                        text: `Couldn't initialise Kin Client`,
                        happy: false,
                      });
                    },
                    kinNetwork,
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
        </>
      ) : null}
      {serverAppIndex && serverKinNetwork ? (
        <>
          <br />
          <hr />
          <h3 className="Kin-section">{`Manage Kin Accounts`}</h3>

          <KinAction
            title="Create a Kin Account for a User"
            linksTitle={kinLinks.serverCodeSamples.title}
            links={kinLinks.serverCodeSamples.methods.createAccount}
            actions={[
              {
                name: 'Create',
                onClick: () => {
                  const exists = userAccountNames.includes(newUserName);
                  if (exists) {
                    makeToast({
                      text: 'Username already exists',
                      happy: false,
                    });
                  } else {
                    setLoading(true);
                    handleCreateAccount({
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
          />

          <KinAction
            title="Get an Account Balance"
            linksTitle={kinLinks.serverCodeSamples.title}
            links={kinLinks.serverCodeSamples.methods.getBalance}
            actions={[
              {
                name: 'Get Balance',
                onClick: () => {
                  setLoading(true);
                  handleGetBalance({
                    user: balanceUser,
                    onSuccess: (balance) => {
                      setLoading(false);
                      setDisplayBalance(balance.toString());
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
                onClick: async () => {
                  const user = userAccounts.find(
                    (account) => account.name === balanceUser
                  );

                  const address = user?.publicKey;
                  openExplorer({
                    address,
                    kinNetwork,
                  });
                },
              },
            ]}
            inputs={[
              {
                name: 'User',
                value: balanceUser,
                options: ['App', ...userAccountNames],
                onChange: (user) => {
                  setBalanceUser(user);
                  setDisplayBalance('');
                },
              },
            ]}
            displayValue={
              displayBalance
                ? `${
                    balanceUser || userAccountNames[0]
                  } has ${displayBalance} Kin`
                : ''
            }
          />

          <br />
          <hr />

          <h3 className="Kin-section">{`Make payments and earn Kin via the KRE`}</h3>

          {(() => {
            if (!userAccountNames.length) {
              return <h4>Why not add some users?</h4>;
            }

            return null;
          })()}

          {kinNetwork === 'Test' ? (
            <KinAction
              title="Request Airdrop (Test Network Only)"
              subTitle="Get some kin so you can start testing your transaction code"
              linksTitle={kinLinks.serverCodeSamples.title}
              links={kinLinks.serverCodeSamples.methods.requestAirdrop}
              disabled={!airdropAmount}
              actions={[
                {
                  name: 'Request',
                  onClick: () => {
                    setLoading(true);
                    handleRequestAirdrop({
                      to: airdropUser,
                      amount: airdropAmount,
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
                  options: ['App', ...userAccountNames],
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

          <KinAction
            title="Pay Kin from App To User - Earn Transaction"
            linksTitle={kinLinks.serverCodeSamples.title}
            links={kinLinks.serverCodeSamples.methods.submitPayment}
            actions={[
              {
                name: 'Pay',
                onClick: () => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    from: 'App',
                    to: payToUserEarn || userAccountNames[0],
                    amount: payAmountEarn,

                    type: 'Earn',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountEarn('');

                      setShouldUpdate(true);
                    },
                    onFailure: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                    },
                  };

                  handleSendKin(sendKinOptions);
                },
              },
            ]}
            inputs={[
              {
                name: 'To',
                value: payToUserEarn || userAccountNames[0],
                options: userAccountNames,
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
            disabled={!serverAppIndex || userAccountNames.length < 1}
          />
          <KinAction
            title="Pay Kin from User To App - Spend Transaction"
            linksTitle={kinLinks.serverCodeSamples.title}
            links={kinLinks.serverCodeSamples.methods.submitPayment}
            subTitle="Requires 'sign_transaction' Webhook if you've added it on the Kin Developer Portal"
            actions={[
              {
                name: 'Pay',
                onClick: () => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    from: payFromUserSpend || userAccountNames[0],
                    to: 'App',
                    amount: payAmountSpend,
                    type: 'Spend',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountSpend('');
                      setShouldUpdate(true);
                    },
                    onFailure: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                    },
                  };

                  handleSendKin(sendKinOptions);
                },
              },
            ]}
            inputs={[
              {
                name: 'From',
                value: payFromUserSpend || userAccountNames[0],
                options: userAccountNames,
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
            disabled={!serverAppIndex || userAccountNames.length < 1}
          />
          <KinAction
            title="Send Kin from User to User -  P2P Transaction"
            linksTitle={kinLinks.serverCodeSamples.title}
            links={kinLinks.serverCodeSamples.methods.submitPayment}
            subTitle="Requires 'sign_transaction' Webhook if you've added it on the Kin Developer Portal"
            actions={[
              {
                name: 'Send',
                onClick: () => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    from: payFromUserP2P || userAccountNames[0],
                    to: payToUserP2P || userAccountNames[1],
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
                    sendKinOptions.from !== sendKinOptions.to
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
                value: payFromUserP2P || userAccountNames[0],
                options: userAccountNames,
                onChange: (user) => {
                  setPayFromUserP2P(user);
                },
              },
              {
                name: 'To',
                value: payToUserP2P || userAccountNames[1],
                options: userAccountNames,
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
            disabled={!serverAppIndex || userAccountNames.length < 2}
          />

          <KinAction
            title="Get Transaction Details"
            subTitle="Transactions may take a little time to appear"
            linksTitle={kinLinks.serverCodeSamples.title}
            links={kinLinks.serverCodeSamples.methods.getTransaction}
            actions={[
              {
                name: 'Get Transaction',
                onClick: () => {
                  setLoading(true);
                  handleGetTransaction({
                    transaction:
                      inputTransaction ||
                      selectedTransaction ||
                      transactions[0],
                    onSuccess: (transaction) => {
                      setLoading(false);
                      makeToast({ text: 'Got Transaction Data!', happy: true });
                      setGotTransaction(transaction);
                    },
                    onFailure: () => {
                      setLoading(false);
                      setGotTransaction(null);
                      makeToast({
                        text: "Couldn't get Transaction data!",
                        happy: false,
                      });
                    },
                  });
                },
              },
              {
                name: 'See in Explorer',
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
                  setGotTransaction(null);
                },
              },
              {
                name: 'Transaction',
                value: selectedTransaction || transactions[0],
                options: [...transactions],
                onChange: (transaction) => {
                  setSelectedTransaction(transaction);
                  setInputTransaction('');
                  setGotTransaction(null);
                },
                disabledInput:
                  !transactions.length || !!inputTransaction.length,
              },
            ]}
            displayOutput={gotTransaction ? gotTransaction : null}
          />
          <br />
          <hr />
        </>
      ) : null}
    </div>
  );
}
