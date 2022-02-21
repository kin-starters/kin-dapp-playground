import {
  KinClient,
  KinProd,
  KinTest,
  TransactionType,
  createWallet,
} from '@kin-sdk/client';

import {
  saveAccount,
  saveTransaction,
  getPublicKey,
  getPrivateKey,
} from './helpers';

interface HandleSetupKinClient {
  kinNetwork: string;
  onSuccess: ({ client }: { client: KinClient }) => void;
  onFailure: () => void;
}
export function handleSetUpKinClient({
  kinNetwork,
  onSuccess,
  onFailure,
}: HandleSetupKinClient) {
  try {
    const appIndex = Number(process.env.REACT_APP_APP_INDEX);
    console.log('🚀 ~ handleSetUpKinClient', kinNetwork, appIndex);
    if (appIndex > 0) {
      const client = new KinClient(kinNetwork === 'Prod' ? KinProd : KinTest, {
        appIndex,
      });
      onSuccess({ client });
    } else {
      throw new Error('No App Index');
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}

interface HandleCreateAccount {
  kinClient: KinClient;
  name: string;
  kinNetwork: string;

  onSuccess: () => void;
  onFailure: () => void;
}

// createWallet needs global.buffer
// ReferenceError: Buffer is not defined
(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;

export async function handleCreateAccount({
  onSuccess,
  onFailure,
  name,
  kinNetwork,
  kinClient,
}: HandleCreateAccount) {
  console.log('🚀 ~ handleCreateAccount', name);
  try {
    const wallet = createWallet('create', { name });

    if (wallet.secret) {
      const [account, createAccountError] = await kinClient.createAccount(
        wallet.secret
      );

      if (createAccountError) throw new Error(createAccountError);

      if (account) {
        const [balances, error] = await kinClient.getBalances(account);
        if (error) throw new Error("Couldn't find account");

        const tokenAccounts = balances.map((balance) => balance.account || '');

        if (tokenAccounts.length) {
          saveAccount(
            {
              ...wallet,
              tokenAccounts,
            },
            kinNetwork
          );
          onSuccess();
        }
      }
    }

    // confirm account creation
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
interface HandleGetBalance {
  kinClient: KinClient;
  user: string;
  kinNetwork: string;
  onSuccess: (arg: string) => void;
  onFailure: () => void;
}

export async function handleGetBalance({
  onSuccess,
  onFailure,
  user,
  kinClient,
  kinNetwork,
}: HandleGetBalance) {
  console.log('🚀 ~ handleGetBalance', user);
  try {
    const publicKey = getPublicKey(user, kinNetwork);

    if (publicKey) {
      // returns an array of objects containing the balances of the different tokenAccounts
      const [balances, error] = await kinClient.getBalances(publicKey);

      if (balances) {
        // produce string of balances for display purposes
        const balanceString = balances.reduce((string, balance) => {
          if (!string && balance.balance) {
            return balance.balance;
          } else if (balance.balance) {
            return `${string}, ${balance.balance}`;
          }

          return string;
        }, '');

        if (balanceString && typeof balanceString === 'string') {
          onSuccess(balanceString);
        } else {
          throw new Error("Couldn't get balance");
        }
      } else {
        throw new Error(error);
      }
    } else {
      throw new Error("Couldn't find publicKey");
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}

interface HandleRequestAirdrop {
  kinClient: KinClient;
  to: string;
  amount: string;
  kinNetwork: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export async function handleRequestAirdrop({
  onSuccess,
  onFailure,
  to,
  amount,
  kinClient,
  kinNetwork,
}: HandleRequestAirdrop) {
  console.log('🚀 ~ handleRequestAirdrop', to, amount);
  try {
    const publicKey = getPublicKey(to, kinNetwork);

    const [success, error] = await kinClient.requestAirdrop(publicKey, amount);

    if (error) throw new Error(error);

    if (success) onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}

interface GetTokenAccountWithSufficientBalance {
  user: string;
  amount: string;
  kinClient: KinClient;
  kinNetwork: string;
}

async function getTokenAccountWithSufficientBalance({
  user,
  amount,
  kinClient,
  kinNetwork,
}: GetTokenAccountWithSufficientBalance) {
  const publicKey = getPublicKey(user, kinNetwork);

  const [balances, error] = await kinClient.getBalances(publicKey);

  if (balances) {
    const tokenAccountWithBalance = balances.find(
      (balance) => Number(balance.balance) > Number(amount)
    );

    if (!tokenAccountWithBalance) {
      throw new Error('No token account with enough balance.');
    } else {
      return tokenAccountWithBalance.account;
    }
  } else {
    throw new Error(error);
  }
}

export interface HandleSendKin {
  kinClient: KinClient;
  from: string;
  to: string;
  amount: string;
  type: string;
  kinNetwork: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

export async function handleSendKin({
  onSuccess,
  onFailure,
  from,
  to,
  amount,
  type,
  kinClient,
  kinNetwork,
}: HandleSendKin) {
  console.log('🚀 ~ handleSendKin', type, from, to, amount);
  try {
    const secret = getPrivateKey(from, kinNetwork);
    const tokenAccount = await getTokenAccountWithSufficientBalance({
      user: from,
      amount,
      kinClient,
      kinNetwork,
    });
    const destination = getPublicKey(to, kinNetwork);

    let transactionType = TransactionType.None;
    if (type === 'Earn') transactionType = TransactionType.Earn;
    if (type === 'Spend') transactionType = TransactionType.Spend;
    if (type === 'P2P') transactionType = TransactionType.P2P;

    if (secret && tokenAccount && destination) {
      const options = {
        secret,
        tokenAccount,
        destination,
        amount,
        type: transactionType,
      };

      const [transaction, error] = await kinClient.submitPayment(options);
      if (transaction) {
        saveTransaction(transaction);
        onSuccess();
      }

      if (error) throw new Error(error);
    } else {
      throw new Error("Couldn't make transaction");
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}
