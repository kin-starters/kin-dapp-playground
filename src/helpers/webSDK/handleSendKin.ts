import { KinClient, TransactionType, Memo } from '@kin-sdk/client';

import { saveTransaction, getPublicKey, getPrivateKey } from '..';

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
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      const string = 'Str must be 29 chars or less.';
      let foreignKey = Buffer.alloc(29);
      if (string) {
        foreignKey = Buffer.from(string);
      }
      console.log('🚀 ~ foreignKey length', foreignKey.toString().length);

      const memo = Memo.new(
        1,
        transactionType,
        360,
        foreignKey
      ).buffer.toString('base64');
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

      const options = {
        secret,
        tokenAccount,
        destination,
        amount,
        type: transactionType,
        memo,
      };
      console.log('🚀 ~ options', options);

      const [transaction, error] = await kinClient.submitPayment(options);
      console.log('🚀 ~ transaction', transaction);
      console.log('🚀 ~ error', error);
      if (transaction) {
        saveTransaction(transaction, kinNetwork);
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
