import SecureLS from 'secure-ls';

import {
  KinClient,
  KinProd,
  KinTest,
  Wallet,
  TransactionType,
  createWallet,
} from '@kin-sdk/client';

// https://github.com/softvar/secure-ls
export const secureLocalStorage = new SecureLS();
console.log('🚀 ~ secureLocalStorage', secureLocalStorage);

// We are just saving into localStorage. Make sure your app uses a secure solution.
interface Account extends Wallet {
  tokenAccounts: string[];
}
function saveAccount(account: Account, kinEnvironment: string) {
  const accounts = secureLocalStorage.get(`accounts${kinEnvironment}`) || [];
  if (account.publicKey)
    secureLocalStorage.set(`accounts${kinEnvironment}`, [...accounts, account]);
}

export function getUserAccounts(kinEnvironment: string): string[] {
  try {
    const accounts = secureLocalStorage.get(`accounts${kinEnvironment}`) || [];
    return accounts.map((account: Account) => account.name);
  } catch (error) {
    return [];
  }
}

export function getUserAccount(
  user: string,
  kinEnvironment: string
): Account | null {
  const accounts = secureLocalStorage.get(`accounts${kinEnvironment}`) || [];
  const userAccount = accounts.find(
    (account: Account) => account.name === user
  );

  return userAccount || null;
}

function getPrivateKey(user: string, kinEnvironment: string): string {
  const account = getUserAccount(user, kinEnvironment);
  return account?.secret || '';
}

export function getPublicKey(user: string, kinEnvironment: string): string {
  const account = getUserAccount(user, kinEnvironment);
  return account?.publicKey || '';
}

function saveTransaction(transaction: string) {
  const transactions = secureLocalStorage.get('transactions') || [];
  secureLocalStorage.set('transactions', [...transactions, transaction]);
}

export function getTransactions() {
  try {
    const transactions = secureLocalStorage.get('transactions') || [];
    return transactions;
  } catch (error) {
    console.log('🚀 ~ error', error);
    return [];
  }
}

// SDK Related Functions

interface HandleSetupKinClient {
  kinEnvironment: string;
  onSuccess: ({ client }: { client: KinClient }) => void;
  onFailure: () => void;
}
export function handleSetupKinClient({
  kinEnvironment,
  onSuccess,
  onFailure,
}: HandleSetupKinClient) {
  console.log('🚀 ~ handleSetupKinClient', kinEnvironment);
  try {
    const appIndex = Number(process.env.REACT_APP_APP_INDEX);
    if (appIndex > 0) {
      const client = new KinClient(
        kinEnvironment === 'Prod' ? KinProd : KinTest,
        { appIndex }
      );
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
  kinEnvironment: string;

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
  kinEnvironment,
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
            kinEnvironment
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
  kinEnvironment: string;
  onSuccess: (arg: string) => void;
  onFailure: () => void;
}

export async function handleGetBalance({
  onSuccess,
  onFailure,
  user,
  kinClient,
  kinEnvironment,
}: HandleGetBalance) {
  console.log('🚀 ~ handleGetBalance', user);
  try {
    const publicKey = getPublicKey(user, kinEnvironment);

    if (publicKey) {
      const [balances, error] = await kinClient.getBalances(publicKey);

      if (balances) {
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
  kinEnvironment: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export async function handleRequestAirdrop({
  onSuccess,
  onFailure,
  to,
  amount,
  kinClient,
  kinEnvironment,
}: HandleRequestAirdrop) {
  console.log('🚀 ~ handleRequestAirdrop', to, amount);
  try {
    const publicKey = getPublicKey(to, kinEnvironment);

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
  kinEnvironment: string;
}

async function getTokenAccountWithSufficientBalance({
  user,
  amount,
  kinClient,
  kinEnvironment,
}: GetTokenAccountWithSufficientBalance) {
  const publicKey = getPublicKey(user, kinEnvironment);

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
  kinEnvironment: string;
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
  kinEnvironment,
}: HandleSendKin) {
  console.log('🚀 ~ handleSendKin', type, from, to, amount);
  try {
    const secret = getPrivateKey(from, kinEnvironment);

    // TODO Discuss with Bram should tokenAccount be tokenAccount or publicKey?
    // const tokenAccount = getPublicKey(from);
    const tokenAccount = await getTokenAccountWithSufficientBalance({
      user: from,
      amount,
      kinClient,
      kinEnvironment,
    });
    const destination = getPublicKey(to, kinEnvironment);

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
