import axios from 'axios';
import {
  KinClient,
  // KinClientOptions,
  KinProd,
  KinTest,
  Wallet,
  createWallet,
} from '@kin-sdk/client';

interface BalanceResponse {
  data: number;
  status: number;
}
interface TransactionResponse {
  data: Transaction;
  status: number;
}

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

// We are just saving into localStorage. Make sure your app uses a secure solution.
function saveWallet(wallet: Wallet) {
  const walletsJSON = localStorage.getItem('wallets');
  const wallets = walletsJSON ? JSON.parse(walletsJSON) : [];
  if (wallet.publicKey)
    localStorage.setItem('wallets', JSON.stringify([wallet, ...wallets]));
}

export async function handleCreateAccount({
  onSuccess,
  onFailure,
  name,
  kinClient,
}: HandleCreateAccount) {
  try {
    const wallet = createWallet('create', { name });
    saveWallet(wallet);
    console.log('🚀 ~ wallet', wallet);

    const account =
      wallet.secret && (await kinClient.createAccount(wallet.secret));
    console.log('🚀 ~ account', account);

    // confirm account creation
    const balances =
      wallet.publicKey && (await kinClient.getBalances(wallet.publicKey));
    console.log('🚀 ~ balances', balances);

    if (!balances) throw new Error("Couldn't find balances");
    if (balances && !balances[0]) throw new Error("Couldn't find account");
    if (balances && balances[0]) {
      onSuccess();
    }
  } catch (error) {
    onFailure(error);
  }
}
interface HandleGetBalance {
  user: string;
  onSuccess: (arg: number) => void;
  onFailure: (arg: any) => void;
}

export async function handleGetBalance({
  onSuccess,
  onFailure,
  user,
}: HandleGetBalance) {
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const url = `${baseUrl}/balance?user=${user}`;
    const response: BalanceResponse = await axios.get(url);
    onSuccess(response.data);
  } catch (error) {
    onFailure(error);
  }
}
interface HandleRequestAirdrop {
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
}: HandleRequestAirdrop) {
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const url = `${baseUrl}/airdrop?to=${to}&amount=${amount}`;
    await axios.post(url);
    onSuccess();
  } catch (error) {
    onFailure(error);
  }
}

export interface HandleSendKin {
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
}: HandleSendKin) {
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const data: {
      from: string;
      to: string;
      amount: string;
      type: string;
    } = {
      from,
      to,
      amount,
      type,
    };

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const url = `${baseUrl}/send`;
    await axios.post(url, data, options);
    onSuccess();
  } catch (error) {
    onFailure(error);
  }
}

interface Payment {
  kin: string;
  type: number;
  sender: string;
  destination: string;
}
export interface Transaction {
  txState: number;
  payments: Payment[];
}
interface HandleGetTransaction {
  transaction: string;
  onSuccess: (transaction: Transaction) => void;
  onFailure: (arg: any) => void;
}

export async function handleGetTransaction({
  transaction,
  onSuccess,
  onFailure,
}: HandleGetTransaction) {
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');
    console.log('🚀 ~ handleGetTransaction', transaction);

    const url = `${baseUrl}/transaction?transaction=${encodeURIComponent(
      transaction
    )}`;
    const { data }: TransactionResponse = await axios.get(url);
    onSuccess(data);
  } catch (error) {
    onFailure(error);
  }
}
