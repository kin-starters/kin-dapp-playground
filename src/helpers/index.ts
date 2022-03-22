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
export function saveAccount(account: Account, kinNetwork: string) {
  const accounts = secureLocalStorage.get(`accounts${kinNetwork}`) || [];
  if (account.publicKey)
    secureLocalStorage.set(`accounts${kinNetwork}`, [...accounts, account]);
}

export function getUserAccounts(kinNetwork: string): string[] {
  try {
    const accounts = secureLocalStorage.get(`accounts${kinNetwork}`) || [];
    return accounts.map((account: Account) => account.name);
  } catch (error) {
    return [];
  }
}

export function getUserAccount(
  user: string,
  kinNetwork: string
): Account | null {
  const accounts = secureLocalStorage.get(`accounts${kinNetwork}`) || [];
  const userAccount = accounts.find(
    (account: Account) => account.name === user
  );

  return userAccount || null;
}

export function getPrivateKey(user: string, kinNetwork: string): string {
  const account = getUserAccount(user, kinNetwork);
  return account?.secret || '';
}

export function getPublicKey(user: string, kinNetwork: string): string {
  const account = getUserAccount(user, kinNetwork);
  return account?.publicKey || '';
}

interface Transaction {
  id: string;
  network: string;
}

export function saveTransaction(transaction: string, network: string) {
  const transactions = secureLocalStorage.get('transactions') || [];
  secureLocalStorage.set('transactions', [
    ...transactions,
    { id: transaction, network },
  ]);
}

export function getTransactions(network: string) {
  try {
    const transactions = secureLocalStorage.get('transactions') || [];
    return transactions
      .filter((trn: Transaction) => trn.network === network)
      .map((trn: Transaction) => trn.id);
  } catch (error) {
    console.log('🚀 ~ error', error);
    return [];
  }
}

interface OpenExplorer {
  transaction?: string;
  address?: string;
  kinNetwork?: string;
  solanaNetwork?: string;
}
export function openExplorer({
  transaction,
  address,
  kinNetwork,
  solanaNetwork,
}: OpenExplorer) {
  if (transaction) {
    window.open(
      `https://explorer.solana.com/tx/${transaction}${(() => {
        if (kinNetwork === 'Test') {
          return '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev%2F';
        }
        if (solanaNetwork && solanaNetwork !== 'Mainnet') {
          return `?cluster=${solanaNetwork.toLowerCase()}`;
        }
        return '';
      })()}`
    );
  } else if (address) {
    window.open(
      `https://explorer.solana.com/address/${address}${(() => {
        if (kinNetwork === 'Test') {
          return '?cluster=custom&customUrl=https%3A%2F%2Flocal.validator.agorainfra.dev%2F';
        }
        if (solanaNetwork && solanaNetwork !== 'Mainnet') {
          return `?cluster=${solanaNetwork.toLowerCase()}`;
        }
        return '';
      })()}`
    );
  }
}
