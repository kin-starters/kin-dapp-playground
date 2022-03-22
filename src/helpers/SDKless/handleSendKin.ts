import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  Connection,
} from '@solana/web3.js';
import {
  generateKreTransactionInstructions,
  TransactionType,
} from '@kin-tools/kin-transaction';

import { saveTransaction } from '..';

import { TransactionTypeName, SolanaNetwork, solanaAddresses } from '.';

export interface HandleSendKin {
  connection: Connection;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>;
  from: PublicKey;
  to: string;
  amount: string;
  memo: string;
  type: TransactionTypeName;
  solanaNetwork: SolanaNetwork;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

export async function handleSendKin({
  onSuccess,
  onFailure,
  connection,
  sendTransaction,
  from,
  to,
  amount,
  memo,
  type,
  solanaNetwork,
}: HandleSendKin) {
  console.log('🚀 ~ handleSendKin', from, to, type, amount, solanaNetwork);
  try {
    // App Index **************************************************************
    // Your appIndex so you can qualify for rewards via the KRE
    const appIndex = Number(process.env.REACT_APP_APP_INDEX);
    console.log('🚀 ~ appIndex', appIndex);
    if (!appIndex) throw new Error('No App Index!');

    const mint = new PublicKey(solanaAddresses[solanaNetwork].kinMint);
    console.log('🚀 ~ mint', mint);

    // from tokenAccount ******************************************************
    const fromTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      from,
      { mint }
    );
    // Here we are going to assume the first tokenAccount is the one we want
    // You could implement a check to make sure it has sufficient balance
    const fromTokenAccount = fromTokenAccounts?.value[0]?.pubkey;
    if (!fromTokenAccount) throw new Error('No From Token Account!');
    console.log('🚀 ~ fromTokenAccount', fromTokenAccount.toBase58());

    // to tokenAccount ********************************************************
    const toPublicKey = new PublicKey(to);
    const toTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      toPublicKey,
      { mint }
    );
    // Again, we are going to assume the first one is the one we want.
    // You could do a balance check and choose the one with the largest balance if necessary
    const toTokenAccount = toTokenAccounts?.value[0]?.pubkey;
    if (!toTokenAccount) throw new Error('No destination Token Account!');
    console.log('🚀 ~ toTokenAccount', toTokenAccount.toBase58());

    // Transaction Instructions *********************************************
    // 1 - Memo Program Instruction containing appIndex and transaction type formatted to be picked up by the KRE
    // 2 - Token Program Instruction for transferring Kin
    const instructionsWithKRE = await generateKreTransactionInstructions({
      type: TransactionType[type],
      appIndex,
      from,
      fromTokenAccount,
      toTokenAccount,
      amount,
    });

    // Transaction ************************************************************
    const transaction = new Transaction().add(
      ...instructionsWithKRE // Must be the first two instructions in order
    );

    // Add additional memo, e.g. for SKU if present.
    if (memo) {
      const additionalMemoInstruction = new TransactionInstruction({
        keys: [],
        programId: new PublicKey('Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo'),
        data: Buffer.from(memo),
      });
      transaction.add(additionalMemoInstruction);
    }

    // Final Transaction
    console.log('🚀 ~ transaction', transaction);

    // Send Transaction
    const signature = await sendTransaction(transaction, connection);
    console.log('🚀 ~ signature', signature);
    saveTransaction(signature, solanaNetwork);

    // Check Transaction has been completed
    await connection.confirmTransaction(signature, 'processed');

    onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}
