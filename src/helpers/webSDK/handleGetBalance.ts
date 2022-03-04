import { KinClient } from '@kin-sdk/client';

import { getPublicKey } from '..';

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
