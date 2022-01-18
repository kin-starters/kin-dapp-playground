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
  handleGetTransaction,
  Transaction,
  Invoice,
  HandleSendKin,
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
  const [transactions, setTransactions] = useState<string[]>([]);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  useEffect(() => {
    if (shouldUpdate) {
      checkServerRunning({
        onSuccess: ({ status, data }) => {
          setServerRunning(status === 200);
          setServerAppIndex(data.appIndex);
          setUserAccounts(data.users);
          setTransactions(data.transactions);
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

  const [inputTransaction, setInputTransaction] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [gotTransaction, setGotTransaction] = useState<Transaction | null>(
    null
  );

  const [payFromUserP2P, setPayFromUserP2P] = useState('');
  const [payToUserP2P, setPayToUserP2P] = useState('');
  const [payAmountP2P, setPayAmountP2P] = useState('');
  const [payMemoP2P, setPayMemoP2P] = useState('');
  const [payInvoiceP2PTitle, setPayInvoiceP2PTitle] = useState('');
  const [payInvoiceP2PDescription, setPayInvoiceP2PDescription] = useState('');
  const [payInvoiceP2PAmount, setPayInvoiceP2PAmount] = useState('');
  const [payInvoiceP2PSku, setPayInvoiceP2PSku] = useState('');
  const [payInvoiceP2P, setPayInvoiceP2P] = useState<Invoice | null>(null);
  useEffect(() => {
    if (payInvoiceP2PTitle.length) {
      setPayMemoP2P('');
      const invoice: Invoice = { title: payInvoiceP2PTitle };
      if (payInvoiceP2PDescription)
        invoice.description = payInvoiceP2PDescription;
      if (payInvoiceP2PDescription) invoice.amount = payInvoiceP2PAmount;
      if (payInvoiceP2PDescription) invoice.sku = payInvoiceP2PSku;
      setPayInvoiceP2P(invoice);
    } else {
      setPayInvoiceP2P(null);
    }

    if (payMemoP2P) {
      setPayInvoiceP2PTitle('');
      setPayInvoiceP2PDescription('');
      setPayInvoiceP2PAmount('');
      setPayInvoiceP2PSku('');
      setPayInvoiceP2P(null);
    }
  }, [
    payMemoP2P,
    payInvoiceP2PTitle,
    payInvoiceP2PDescription,
    payInvoiceP2PAmount,
    payInvoiceP2PSku,
  ]);

  const [payFromUserSpend, setPayFromUserSpend] = useState('');
  const [payAmountSpend, setPayAmountSpend] = useState('');
  const [payMemoSpend, setPayMemoSpend] = useState('');
  const [payInvoiceSpendTitle, setPayInvoiceSpendTitle] = useState('');
  const [payInvoiceSpendDescription, setPayInvoiceSpendDescription] = useState(
    ''
  );
  const [payInvoiceSpendAmount, setPayInvoiceSpendAmount] = useState('');
  const [payInvoiceSpendSku, setPayInvoiceSpendSku] = useState('');
  const [payInvoiceSpend, setPayInvoiceSpend] = useState<Invoice | null>(null);
  useEffect(() => {
    if (payInvoiceSpendTitle.length) {
      setPayMemoSpend('');
      const invoice: Invoice = { title: payInvoiceSpendTitle };
      if (payInvoiceSpendDescription)
        invoice.description = payInvoiceSpendDescription;
      if (payInvoiceSpendDescription) invoice.amount = payInvoiceSpendAmount;
      if (payInvoiceSpendDescription) invoice.sku = payInvoiceSpendSku;
      setPayInvoiceSpend(invoice);
    } else {
      setPayInvoiceSpend(null);
    }

    if (payMemoSpend) {
      setPayInvoiceSpendTitle('');
      setPayInvoiceSpendDescription('');
      setPayInvoiceSpendAmount('');
      setPayInvoiceSpendSku('');
      setPayInvoiceSpend(null);
    }
  }, [
    payMemoSpend,
    payInvoiceSpendTitle,
    payInvoiceSpendDescription,
    payInvoiceSpendAmount,
    payInvoiceSpendSku,
  ]);

  const [payToUserEarn, setPayToUserEarn] = useState('');
  const [payAmountEarn, setPayAmountEarn] = useState('');
  const [payMemoEarn, setPayMemoEarn] = useState('');
  const [payInvoiceEarnTitle, setPayInvoiceEarnTitle] = useState('');
  const [payInvoiceEarnDescription, setPayInvoiceEarnDescription] = useState(
    ''
  );
  const [payInvoiceEarnAmount, setPayInvoiceEarnAmount] = useState('');
  const [payInvoiceEarnSku, setPayInvoiceEarnSku] = useState('');
  const [payInvoiceEarn, setPayInvoiceEarn] = useState<Invoice | null>(null);
  useEffect(() => {
    if (payInvoiceEarnTitle.length) {
      setPayMemoEarn('');
      const invoice: Invoice = { title: payInvoiceEarnTitle };
      if (payInvoiceEarnDescription)
        invoice.description = payInvoiceEarnDescription;
      if (payInvoiceEarnDescription) invoice.amount = payInvoiceEarnAmount;
      if (payInvoiceEarnDescription) invoice.sku = payInvoiceEarnSku;
      setPayInvoiceEarn(invoice);
    } else {
      setPayInvoiceEarn(null);
    }

    if (payMemoEarn) {
      setPayInvoiceEarnTitle('');
      setPayInvoiceEarnDescription('');
      setPayInvoiceEarnAmount('');
      setPayInvoiceEarnSku('');
      setPayInvoiceEarn(null);
    }
  }, [
    payMemoEarn,
    payInvoiceEarnTitle,
    payInvoiceEarnDescription,
    payInvoiceEarnAmount,
    payInvoiceEarnSku,
  ]);

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
                  {`Register on the Kin Developer Portal to get your App Index`}
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
          subTitleLinks={kinLinks.devPortal}
          linksTitle={kinLinks.title}
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
            title="Create a Kin Account"
            linksTitle={kinLinks.title}
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
          <KinAction
            title="Get Account Balance"
            linksTitle={kinLinks.title}
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
              linksTitle={kinLinks.title}
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
                    setShouldUpdate(true);
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
            title="Get Transaction"
            subTitle="Transactions may take a little time to appear."
            linksTitle={kinLinks.title}
            links={kinLinks.getTransaction}
            actionName="Get"
            action={() => {
              setLoading(true);
              handleGetTransaction({
                transaction:
                  inputTransaction || selectedTransaction || transactions[0],
                onSuccess: (transaction) => {
                  setLoading(false);
                  makeToast({ text: 'Got Transaction Data!', happy: true });
                  setGotTransaction(transaction);
                },
                onFailure: (error) => {
                  setLoading(false);
                  setGotTransaction(null);
                  makeToast({
                    text: "Couldn't get Transaction data!",
                    happy: false,
                  });
                  console.log(error);
                },
              });
            }}
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

          {userAccounts.length > 0 ? (
            <>
              <KinAction
                title="Pay Kin from App To User - Earn Transaction"
                linksTitle={kinLinks.title}
                links={kinLinks.submitPayment}
                actionName="Pay"
                action={() => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
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
                      setPayInvoiceEarnTitle('');
                      setPayInvoiceEarnDescription('');
                      setPayInvoiceEarnAmount('');
                      setPayInvoiceEarnSku('');
                      setShouldUpdate(true);
                    },
                    onFailure: (error: string) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  };

                  if (payInvoiceEarn) {
                    sendKinOptions.invoice = payInvoiceEarn;
                  }

                  handleSendKin(sendKinOptions);
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
                    disabledInput: !!payInvoiceEarn,
                  },
                  {
                    name: 'Invoice',
                    inputs: [
                      {
                        name: 'Title (Required)',
                        value: payInvoiceEarnTitle,
                        onChange: setPayInvoiceEarnTitle,
                      },
                      {
                        name: 'Description',
                        value: payInvoiceEarnDescription,
                        onChange: setPayInvoiceEarnDescription,
                      },
                      {
                        name: 'Amount',
                        value: payInvoiceEarnAmount,
                        onChange: setPayInvoiceEarnAmount,
                      },
                      {
                        name: 'Sku',
                        value: payInvoiceEarnSku,
                        onChange: setPayInvoiceEarnSku,
                      },
                    ],
                    disabledInput: !!payMemoEarn,
                  },
                ]}
              />
              <KinAction
                title="Pay Kin from User To App - Spend Transaction"
                linksTitle={kinLinks.title}
                links={kinLinks.submitPayment}
                subTitle="Requires 'sign_transaction' Webhook"
                actionName="Pay"
                action={() => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
                    from: payFromUserSpend || userAccounts[0],
                    to: 'App',
                    amount: payAmountSpend,
                    memo: payMemoSpend,
                    type: 'Spend',
                    onSuccess: () => {
                      setLoading(false);
                      makeToast({ text: 'Send Successful!', happy: true });
                      setPayAmountSpend('');
                      setPayMemoSpend('');
                      setPayInvoiceSpendTitle('');
                      setPayInvoiceSpendDescription('');
                      setPayInvoiceSpendAmount('');
                      setPayInvoiceSpendSku('');
                      setShouldUpdate(true);
                    },
                    onFailure: (error: string) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  };

                  if (payInvoiceSpend) {
                    sendKinOptions.invoice = payInvoiceSpend;
                  }

                  handleSendKin(sendKinOptions);
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
                    disabledInput: !!payInvoiceSpend,
                  },
                  {
                    name: 'Invoice',
                    inputs: [
                      {
                        name: 'Title (Required)',
                        value: payInvoiceSpendTitle,
                        onChange: setPayInvoiceSpendTitle,
                      },
                      {
                        name: 'Description',
                        value: payInvoiceSpendDescription,
                        onChange: setPayInvoiceSpendDescription,
                      },
                      {
                        name: 'Amount',
                        value: payInvoiceSpendAmount,
                        onChange: setPayInvoiceSpendAmount,
                      },
                      {
                        name: 'Sku',
                        value: payInvoiceSpendSku,
                        onChange: setPayInvoiceSpendSku,
                      },
                    ],
                    disabledInput: !!payMemoSpend,
                  },
                ]}
              />
              <KinAction
                title="Send Kin from User to User -  P2P Transaction"
                linksTitle={kinLinks.title}
                links={kinLinks.submitPayment}
                subTitle="Requires 'sign_transaction' Webhook"
                actionName="Send"
                action={() => {
                  setLoading(true);

                  const sendKinOptions: HandleSendKin = {
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
                      setPayInvoiceP2PTitle('');
                      setPayInvoiceP2PDescription('');
                      setPayInvoiceP2PAmount('');
                      setPayInvoiceP2PSku('');
                      setShouldUpdate(true);
                    },
                    onFailure: (error: string) => {
                      setLoading(false);
                      makeToast({ text: 'Send Failed!', happy: false });
                      console.log(error);
                    },
                  };

                  if (payInvoiceP2P) {
                    sendKinOptions.invoice = payInvoiceP2P;
                  }

                  handleSendKin(sendKinOptions);
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
                    disabledInput: !!payInvoiceP2P,
                  },
                  {
                    name: 'Invoice',
                    inputs: [
                      {
                        name: 'Title (Required)',
                        value: payInvoiceP2PTitle,
                        onChange: setPayInvoiceP2PTitle,
                      },
                      {
                        name: 'Description',
                        value: payInvoiceP2PDescription,
                        onChange: setPayInvoiceP2PDescription,
                      },
                      {
                        name: 'Amount',
                        value: payInvoiceP2PAmount,
                        onChange: setPayInvoiceP2PAmount,
                      },
                      {
                        name: 'Sku',
                        value: payInvoiceP2PSku,
                        onChange: setPayInvoiceP2PSku,
                      },
                    ],
                    disabledInput: !!payMemoP2P,
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
