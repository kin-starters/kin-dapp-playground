import { useState, useEffect } from 'react';

import { KinAction } from './KinAction';
import { Links } from './Links';

import { kinLinks } from './constants';

import {
  MakeToast,
  checkServerRunning,
  handleSetupKinClient,
  handleCreateAccount,
  handleGetBalance,
  handleRequestAirdrop,
  handleSendKin,
} from './helpers';

import './Kin.scss';

interface KinProps {
  makeToast: (arg: MakeToast) => void;
  setLoading: (arg: boolean) => void;
}
function Kin({ makeToast, setLoading }: KinProps) {
  const [serverRunning, setServerRunning] = useState(false);
  const [serverAppIndex, setServerAppIndex] = useState(0);
  const [userAccounts, setUserAccounts] = useState<string[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (shouldUpdate) {
      checkServerRunning({
        onSuccess: ({ status, data }) => {
          setServerRunning(status === 200);
          setServerAppIndex(data.appIndex);
          setUserAccounts(data.users);
        },
        onFailure: () => setServerRunning(false),
      });

      setShouldUpdate(false);
    }
  }, [shouldUpdate]);
  const [kinEnvironment, setKinEnvironment] = useState('Test');
  const [appIndex, setAppIndex] = useState('');

  const [newUserName, setNewUserName] = useState('');

  const [balanceUser, setBalanceUser] = useState('App');
  const [displayBalance, setDisplayBalance] = useState('');

  const [airdropUser, setAirdropUser] = useState('App');
  const [airdropAmount, setAirdropAmount] = useState('');

  const [payFromUserP2P, setPayFromUserP2P] = useState('');
  const [payToUserP2P, setPayToUserP2P] = useState('');
  const [payAmountP2P, setPayAmountP2P] = useState('');
  const [payMemoP2P, setPayMemoP2P] = useState('');

  const [payFromUserSpend, setPayFromUserSpend] = useState('');
  const [payAmountSpend, setPayAmountSpend] = useState('');
  const [payMemoSpend, setPayMemoSpend] = useState('');

  const [payToUserEarn, setPayToUserEarn] = useState('');
  const [payAmountEarn, setPayAmountEarn] = useState('');
  const [payMemoEarn, setPayMemoEarn] = useState('');

  return (
    <div className="Kin">
      <div className={`Kin-status ${serverRunning ? 'up' : 'down'}`}>
        {serverRunning ? (
          <span>
            Server Running{' '}
            {serverAppIndex ? (
              <>
                <br />
                App Index {serverAppIndex}
              </>
            ) : (
              <>
                <br />
                <span>
                  Please set up your App on the{` `}
                  <Links links={kinLinks.devPortal} />
                </span>
              </>
            )}
          </span>
        ) : (
          <span>
            {`Server not running`}
            <br />
            <Links
              links={kinLinks.serverRepos}
              linksTitle="Example Servers: "
            />
          </span>
        )}
        {/* : 'Server Not Running'} */}
      </div>

      {serverRunning ? (
        <KinAction
          title="Setup Your Kin Client with your App Index"
          linksTitle={`Server code examples: `}
          links={kinLinks.setupClient}
          actionName="Setup"
          action={() => {
            setLoading(true);
            handleSetupKinClient({
              onSuccess: () => {
                setLoading(false);
                makeToast({
                  text: `Connected to App Index ${appIndex}!`,
                  happy: true,
                });
                setShouldUpdate(true);
              },
              onFailure: (error) => {
                setLoading(false);
                makeToast({
                  text: `Couldn't connect to App Index ${serverAppIndex}!`,
                  happy: false,
                });
                console.log(error);
              },
              kinEnvironment,
              appIndex,
            });
          }}
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
          disabled={!appIndex || appIndex === serverAppIndex.toString()}
        />
      ) : null}

      {serverAppIndex ? (
        <>
          <KinAction
            title="Get Account Balance"
            linksTitle={`Server code examples: `}
            links={kinLinks.getBalance}
            actionName="Get"
            action={() => {
              setLoading(true);
              handleGetBalance({
                user: balanceUser,
                onSuccess: (balance) => {
                  setLoading(false);
                  setDisplayBalance(balance.toString());
                },
                onFailure: (error) => {
                  setLoading(false);
                  console.log(error);
                },
              });
            }}
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
              linksTitle={`Server code examples: `}
              links={kinLinks.requestAirdrop}
              actionName="Request"
              action={() => {
                setLoading(true);
                handleRequestAirdrop({
                  to: airdropUser,
                  amount: airdropAmount,
                  onSuccess: () => {
                    setLoading(false);
                    makeToast({ text: 'Airdrop Successful!', happy: true });
                    setAirdropAmount('');
                  },
                  onFailure: (error) => {
                    setLoading(false);
                    makeToast({ text: 'Airdrop Failed!', happy: false });
                    console.log(error);
                  },
                });
              }}
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

          <KinAction
            title="Create a Kin Account"
            linksTitle={`Server code examples: `}
            links={kinLinks.createAccount}
            actionName="Create"
            action={() => {
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
                onFailure: (error) => {
                  setLoading(false);
                  makeToast({
                    text: 'Account Creation Failed!',
                    happy: false,
                  });
                  console.log(error);
                },
              });
            }}
            inputs={[
              {
                name: 'Name',
                value: newUserName,
                onChange: setNewUserName,
              },
            ]}
          />

          {userAccounts.length > 0 ? (
            <>
              <KinAction
                title="Pay Kin from App To User - Earn Transaction"
                linksTitle={`Server code examples: `}
                links={kinLinks.makePayment}
                actionName="Pay"
                action={() => {
                  setLoading(true);
                  handleSendKin({
                    from: 'App',
                    to: payToUserEarn || userAccounts[0],
                    amount: payAmountEarn,
                    memo: payMemoEarn,
                    type: 'Earn',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountEarn('');
                      setPayMemoEarn('');
                    },
                    onFailure: (error) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  });
                }}
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
                  {
                    name: 'Memo',
                    value: payMemoEarn,
                    onChange: setPayMemoEarn,
                  },
                ]}
              />
              <KinAction
                title="Pay Kin from User To App - Spend Transaction"
                linksTitle={`Server code examples: `}
                links={kinLinks.makePayment}
                subTitle="Requires 'sign_transaction' Webhook"
                actionName="Pay"
                action={() => {
                  setLoading(true);
                  handleSendKin({
                    from: payFromUserSpend || userAccounts[0],
                    to: 'App',
                    amount: payAmountSpend,
                    memo: payMemoSpend,
                    type: 'Pay',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountSpend('');
                      setPayMemoSpend('');
                    },
                    onFailure: (error) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  });
                }}
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
                  {
                    name: 'Memo',
                    value: payMemoSpend,
                    onChange: setPayMemoSpend,
                  },
                ]}
              />
              <KinAction
                title="Send Kin from User to User -  P2P Transaction"
                linksTitle={`Server code examples: `}
                links={kinLinks.makePayment}
                subTitle="Requires 'sign_transaction' Webhook"
                actionName="Send"
                action={() => {
                  setLoading(true);
                  handleSendKin({
                    from: payFromUserP2P || userAccounts[0],
                    to: payToUserP2P || userAccounts[0],
                    amount: payAmountP2P,
                    memo: payMemoP2P,
                    type: 'P2P',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountP2P('');
                      setPayMemoP2P('');
                    },
                    onFailure: (error) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  });
                }}
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
                  {
                    name: 'Memo',
                    value: payMemoP2P,
                    onChange: setPayMemoP2P,
                  },
                ]}
                disabled={payFromUserP2P === payToUserP2P}
              />
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default Kin;
