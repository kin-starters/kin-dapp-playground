import { KinClient, createWallet } from '@kin-sdk/client';

import { saveAccount } from '..';

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
