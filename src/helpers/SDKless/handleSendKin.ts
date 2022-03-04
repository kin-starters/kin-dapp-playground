import { PublicKey, Transaction, Connection } from '@solana/web3.js';

import { createKinMemo, TransactionType } from '@kin-tools/kin-memo';

import { saveTransaction } from '..';
import { generateMemoInstruction, generateTransferInstruction } from './';

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
  type: string;
  solanaNetwork: string;
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
    // App Index
    const appIndex = Number(process.env.REACT_APP_APP_INDEX);
    if (!appIndex) throw new Error('No App Index!');

    console.log('🚀 ~ appIndex', appIndex);

    // Transaction Type
    let transactionType = TransactionType.None;
    if (type === 'Earn') transactionType = TransactionType.Earn;
    if (type === 'Spend') transactionType = TransactionType.Spend;
    if (type === 'P2P') transactionType = TransactionType.P2P;

    // Create correctly formatted memo string, including your App Index
    const appIndexMemo = createKinMemo({
      appIndex,
      type: transactionType,
    });
    console.log('🚀 ~ appIndexMemo', appIndexMemo);
    // Create Memo Instruction for KRE Ingestion - Must be Memo Program v1, not v2
    const appIndexMemoInstruction = generateMemoInstruction({
      memoContent: appIndexMemo,
      solanaNetwork,
      memoVersion: 1,
    });
    console.log('🚀 ~ appIndexMemoInstruction', appIndexMemoInstruction);

    // Create Transfer Instruction
    const transferInstruction = await generateTransferInstruction({
      connection,
      from,
      to,
      amount,
      solanaNetwork,
    });

    // Build Transaction -
    const transaction = new Transaction()
      .add(appIndexMemoInstruction) // Must be the first instruction
      .add(transferInstruction);

    // Add additional memo, e.g. for SKU if present. Here we are using Memo Program v2
    if (memo) {
      const memoInstruction = generateMemoInstruction({
        memoContent: memo,
        solanaNetwork,
        memoVersion: 2,
      });
      transaction.add(memoInstruction);
    }

    // Final Transaction
    console.log('🚀 ~ transaction', transaction);

    // Send Transaction
    const signature = await sendTransaction(transaction, connection);
    console.log('🚀 ~ signature', signature);

    // Check Transaction has been completed
    await connection.confirmTransaction(signature, 'processed');

    saveTransaction(signature);

    onSuccess();
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}
