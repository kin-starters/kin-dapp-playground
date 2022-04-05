import axios from 'axios';

interface Response {
  data: string;
  status: number;
}

export interface User {
  publicKey: string;
  name: string;
}
interface StatusResponse {
  data: {
    appIndex: number;
    env: number;
    users: User[];
    transactions: string[];
  };
  status: number;
}
interface BalanceResponse {
  data: number;
  status: number;
}
interface TransactionResponse {
  data: Transaction;
  status: number;
}

interface CheckServerRunning {
  onSuccess: (arg: StatusResponse) => void;
  onFailure: () => void;
}
export async function getServerStatus({
  onSuccess,
  onFailure,
}: CheckServerRunning) {
  console.log('🚀 ~ getServerStatus');
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const url = `${baseUrl}/status`;
    const response: StatusResponse = await axios.get(url);
    onSuccess(response);
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
interface HandleSetupKinClient {
  onSuccess: () => void;
  onFailure: () => void;
  kinNetwork: string;
}
export async function handleSetUpKinClient({
  onSuccess,
  onFailure,
  kinNetwork,
}: HandleSetupKinClient) {
  console.log('🚀 ~ handleSetUpKinClient', kinNetwork);
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const url = `${baseUrl}/setup?env=${kinNetwork}`;
    const response: Response = await axios.post(url);

    if (response.status === 200) {
      onSuccess();
    } else {
      throw new Error('No appIndex');
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}

interface HandleCreateAccount {
  name: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export async function handleCreateAccount({
  onSuccess,
  onFailure,
  name,
}: HandleCreateAccount) {
  console.log('🚀 ~ handleCreateAccount', name);
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const url = `${baseUrl}/account?name=${name}`;
    await axios.post(url);
    onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
interface HandleGetBalance {
  user: string;
  onSuccess: (arg: number) => void;
  onFailure: () => void;
}

export async function handleGetBalance({
  onSuccess,
  onFailure,
  user,
}: HandleGetBalance) {
  console.log('🚀 ~ handleGetBalance', user);
  try {
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const url = `${baseUrl}/balance?user=${user}`;
    const response: BalanceResponse = await axios.get(url);
    onSuccess(response.data);
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
interface HandleRequestAirdrop {
  to: string;
  amount: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export async function handleRequestAirdrop({
  onSuccess,
  onFailure,
  to,
  amount,
}: HandleRequestAirdrop) {
  try {
    console.log('🚀 ~ handleRequestAirdrop', to, amount);
    const baseUrl = process.env.REACT_APP_SERVER_URL;
    if (!baseUrl) throw new Error('No URL');

    const url = `${baseUrl}/airdrop?to=${to}&amount=${amount}`;
    await axios.post(url);
    onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}

export interface HandleSendKin {
  from: string;
  to: string;
  amount: string;
  type: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export async function handleSendKin({
  onSuccess,
  onFailure,
  from,
  to,
  amount,

  type,
}: HandleSendKin) {
  console.log('🚀 ~ handleSendKin', from, to, amount);
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
    console.log('🚀 ~ error', error);
    onFailure();
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
  onFailure: () => void;
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

    const url = `${baseUrl}/transaction?transaction_id=${encodeURIComponent(
      transaction
    )}`;
    const { data }: TransactionResponse = await axios.get(url);
    onSuccess(data);
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure();
  }
}
