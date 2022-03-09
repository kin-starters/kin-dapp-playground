import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, Transaction, Connection } from '@solana/web3.js';

import { solanaAddresses } from '../../constants';
import { saveTransaction } from '..';
import { handleGetKinBalances } from './handleGetKinBalances';

interface HandleCreateTokenAccount {
  connection: Connection;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>;
  from: PublicKey;
  to: string;
  solanaNetwork: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

export async function handleCreateTokenAccount({
  connection,
  sendTransaction,
  from,
  to,
  solanaNetwork,
  onSuccess,
  onFailure,
}: HandleCreateTokenAccount) {
  console.log('🚀 ~ handleCreateTokenAccount', to);
  try {
    if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
      const balances = await handleGetKinBalances({
        connection,
        address: to,
        solanaNetwork,
      });

      if (balances && balances.length > 0)
        throw new Error('Token Account already exists!');

      const mintPublicKey = new PublicKey(
        solanaAddresses[solanaNetwork].kinMint
      );
      const toPublicKey = new PublicKey(to);
      const tokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        toPublicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      console.log('🚀 ~ tokenAccount', tokenAccount);

      let transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          from,
          tokenAccount,
          toPublicKey,
          mintPublicKey,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );

      // Send Transaction
      const signature = await sendTransaction(transaction, connection);
      console.log('🚀 ~ signature', signature);

      // Check Transaction has been completed
      await connection.confirmTransaction(signature, 'processed');

      saveTransaction(signature);
      onSuccess();
    } else {
      throw new Error('Missing Addresses for Kin on that Solana Network');
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}
