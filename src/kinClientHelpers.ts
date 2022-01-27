import SecureLS from 'secure-ls';

import {
  KinClient,
  KinProd,
  KinTest,
  Wallet,
  TransactionType,
  createWallet,
} from '@kin-sdk/client';

interface HandleSetupKinClient {
  kinEnvironment: string;
  appIndex: number;
}
export function handleSetupKinClient({
  kinEnvironment,
  appIndex,
}: HandleSetupKinClient): { client: KinClient; appIndex: number } {
  const client = new KinClient(kinEnvironment === 'Prod' ? KinProd : KinTest, {
    appIndex: Number(appIndex),
  });

  sessionStorage.setItem('clientAppIndex', appIndex.toString());

  return {
    client,
    appIndex,
  };
}

interface HandleCreateAccount {
  kinClient: KinClient;
  name: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

// createWallet needs global.buffer
// ReferenceError: Buffer is not defined
(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;

// https://github.com/softvar/secure-ls
export const secureLocalStorage = new SecureLS();
console.log('🚀 ~ secureLocalStorage', secureLocalStorage);

// We are just saving into localStorage. Make sure your app uses a secure solution.
function saveWallet(wallet: Wallet) {
  const wallets = secureLocalStorage.get('wallets') || [];
  if (wallet.publicKey) secureLocalStorage.set('wallets', [wallet, ...wallets]);
}

export function getUserAccounts(): string[] {
  try {
    const wallets = secureLocalStorage.get('wallets') || [];
    return wallets.map((wallet: Wallet) => wallet.name);
  } catch (error) {
    console.log('🚀 ~ error', error);
    return [];
  }
}

export function getUserWallet(user: string): Wallet | null {
  const wallets = secureLocalStorage.get('wallets') || [];
  const userWallet = wallets.find((wallet: Wallet) => wallet.name === user);

  return userWallet || null;
}

function getPrivateKey(user: string): string {
  if (user === 'App') {
    return process.env.REACT_APP_SECRET_KEY || '';
  }
  const wallet = getUserWallet(user);
  return wallet?.secret || '';
}

function getPublicKey(user: string): string {
  if (user === 'App') {
    return process.env.REACT_APP_PUBLIC_KEY || '';
  }
  const wallet = getUserWallet(user);
  return wallet?.publicKey || '';
}

// async function getTokenAccount(
//   user: string,
//   amount: string,
//   kinClient: KinClient
// ) {
//   if (user === 'App') return process.env.REACT_APP_PUBLIC_KEY;

//   const publicKey = getPublicKey(user);
//   console.log('🚀 ~ publicKey', publicKey);

//   try {
//     const [balances] = await kinClient.getBalances(publicKey);
//     if (balances.length) {
//       const tokenAccountWithBalance = balances.find(
//         (balance) => Number(balance.balance) > Number(amount)
//       );

//       console.log('🚀 ~ tokenAccountWithBalance', tokenAccountWithBalance);
//       return tokenAccountWithBalance?.account || '';
//     } else {
//       throw new Error('No token account with enough balance.');
//     }
//   } catch (error) {
//     console.log('🚀 ~ error', error);
//     return '';
//   }
// }

function saveTransaction(transaction: string) {
  const transactions = secureLocalStorage.get('transactions') || [];
  secureLocalStorage.set('transactions', [transaction, ...transactions]);
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

export async function handleCreateAccount({
  onSuccess,
  onFailure,
  name,
  kinClient,
}: HandleCreateAccount) {
  try {
    const wallet = createWallet('create', { name });
    console.log('🚀 ~ wallet', wallet);
    saveWallet(wallet);

    const account =
      wallet.secret && (await kinClient.createAccount(wallet.secret));
    console.log('🚀 ~ account', account);

    // confirm account creation
    if (wallet.publicKey) {
      const [balances] = await kinClient.getBalances(wallet.publicKey);
      console.log('🚀 ~ balances', balances);
      if (!balances.length) throw new Error("Couldn't find account");
      if (balances[0].balance) onSuccess();
    } else {
      throw new Error("Couldn't find balances");
    }
  } catch (error) {
    onFailure(error);
  }
}
interface HandleGetBalance {
  kinClient: KinClient;
  user: string;
  onSuccess: (arg: string) => void;
  onFailure: (arg: any) => void;
}

export async function handleGetBalance({
  onSuccess,
  onFailure,
  user,
  kinClient,
}: HandleGetBalance) {
  try {
    const publicKey = getPublicKey(user);

    if (publicKey) {
      const balances = await kinClient.getBalances(publicKey);
      console.log('🚀 ~ balances', balances);
      // TODO Discuss this with Bram

      if (balances[0].length) {
        const balanceString = balances[0].reduce((string, balance) => {
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
      }
    } else {
      throw new Error("Couldn't find publicKey");
    }
  } catch (error) {
    onFailure(error);
  }
}
interface HandleRequestAirdrop {
  kinClient: KinClient;
  to: string;
  amount: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

export async function handleRequestAirdrop({
  onSuccess,
  onFailure,
  to,
  amount,
  kinClient,
}: HandleRequestAirdrop) {
  try {
    const publicKey = getPublicKey(to);
    await kinClient.requestAirdrop(publicKey, amount);
    onSuccess();
  } catch (error) {
    onFailure(error);
  }
}

export interface HandleSendKin {
  kinClient: KinClient;
  from: string;
  to: string;
  amount: string;
  type: string;
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
}: HandleSendKin) {
  try {
    const secret = getPrivateKey(from);
    console.log('🚀 ~ secret', secret);

    // TODO Discuss with Bram should tokenAccount be tokenAccount or publicKey?
    const tokenAccount = getPublicKey(from);
    // const tokenAccount = await getTokenAccount(from, amount, kinClient);
    console.log('🚀 ~ tokenAccount', tokenAccount);
    const destination = getPublicKey(to);
    console.log('🚀 ~ destination', destination);

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
        memo: `Transaction type: ${type}`, //  Need to include memo or Spend / P2P will fail. Does this affect appIndex?
        type: transactionType,
      };

      console.log('🚀 ~ options', options);
      const [transaction] = await kinClient.submitPayment(options);
      saveTransaction(transaction);
      console.log('🚀 ~ transaction', transaction);
      onSuccess();
    } else {
      throw new Error("Couldn't make transaction");
    }
  } catch (error) {
    onFailure(error);
  }
}

// interface Payment {
//   kin: string;
//   type: number;
//   sender: string;
//   destination: string;
// }
// export interface Transaction {
//   txState: number;
//   payments: Payment[];
// }
// interface HandleGetTransaction {
//   transaction: string;
//   onSuccess: (transaction: Transaction) => void;
//   onFailure: (arg: any) => void;
// }

// export async function handleGetTransaction({
//   transaction,
//   onSuccess,
//   onFailure,
// }: HandleGetTransaction) {
//   try {
//     const submitTransactionRequest = new SubmitTransactionRequest();
//     const transactionData = submitTransactionRequest.getTransaction(
//       transaction
//     );
//     onSuccess(transactionData);
//   } catch (error) {
//     onFailure(error);
//   }
// }
