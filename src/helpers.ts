import SecureLS from 'secure-ls';
import { Wallet } from '@kin-sdk/client';

export interface MakeToast {
  text: string;
  happy: boolean;
}

// https://github.com/softvar/secure-ls
export const secureLocalStorage = new SecureLS();
console.log('🚀 ~ secureLocalStorage', secureLocalStorage);

// We are just saving into localStorage. Make sure your app uses a secure solution.
interface Account extends Wallet {
  tokenAccounts: string[];
}
export function saveAccount(account: Account, kinEnvironment: string) {
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

export function getPrivateKey(user: string, kinEnvironment: string): string {
  const account = getUserAccount(user, kinEnvironment);
  return account?.secret || '';
}

export function getPublicKey(user: string, kinEnvironment: string): string {
  const account = getUserAccount(user, kinEnvironment);
  return account?.publicKey || '';
}

export function saveTransaction(transaction: string) {
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

interface OpenExplorer {
  transaction?: string;
  address?: string;
  kinEnvironment?: string;
  solanaNetwork?: string;
}
export function openExplorer({
  transaction,
  address,
  kinEnvironment,
  solanaNetwork,
}: OpenExplorer) {
  if (transaction) {
    window.open(
      `https://explorer.solana.com/tx/${transaction}${
        kinEnvironment === 'Test'
          ? '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev%2F'
          : ''
      }${
        solanaNetwork && solanaNetwork !== 'Mainnet'
          ? `?cluster=${solanaNetwork.toLowerCase()}`
          : ''
      }`
    );
  } else if (address) {
    window.open(
      `https://explorer.solana.com/address/${address}${
        kinEnvironment === 'Test'
          ? '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev%2F'
          : ''
      }`
    );
  }
}
