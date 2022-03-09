import {
  createCloseAccountInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey, Transaction, Connection } from '@solana/web3.js';

import { solanaAddresses } from '../../constants';
import { saveTransaction } from '..';

interface HandleCloseEmptyTokenAccount {
  connection: Connection;
  sendTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<string>;
  to: string;
  solanaNetwork: string;
  onSuccess: () => void;
  onFailure: (arg: any) => void;
}

// https://solanacookbook.com/references/token.html#associated-token-account-ata
export async function handleCloseEmptyTokenAccount({
  connection,
  sendTransaction,
  to,
  solanaNetwork,
  onSuccess,
  onFailure,
}: HandleCloseEmptyTokenAccount) {
  console.log('🚀 ~ handleCloseEmptyTokenAccount', to);
  try {
    if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
      const mintPublicKey = new PublicKey(
        solanaAddresses[solanaNetwork].kinMint
      );
      const toPublicKey = new PublicKey(to);

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        toPublicKey,
        {
          mint: mintPublicKey,
        }
      );
      console.log('🚀 ~ tokenAccounts', tokenAccounts);

      if (tokenAccounts.value.length === 0)
        throw new Error('No Token Accounts found');

      const zeroBalanceTokenAccountsRaw = await Promise.all(
        tokenAccounts.value.map(async (tokenAccount) => {
          try {
            const tokenAmount = await connection.getTokenAccountBalance(
              tokenAccount.pubkey
            );
            console.log('🚀 ~ tokenAmount', tokenAmount);

            return tokenAmount.value.amount === '0'
              ? tokenAccount.pubkey
              : null;
          } catch (error) {
            return null;
          }
        })
      );

      const zeroBalanceTokenAccounts = zeroBalanceTokenAccountsRaw.filter(
        (pk) => pk
      );
      console.log('🚀 ~ zeroBalanceTokenAccounts', zeroBalanceTokenAccounts);

      if (zeroBalanceTokenAccounts.length === 0)
        throw new Error('No Zero Balance Token Accounts');

      const signatures = await Promise.all(
        zeroBalanceTokenAccounts.map(async (tokenAccountPublicKey) => {
          if (tokenAccountPublicKey) {
            const transaction = new Transaction().add(
              createCloseAccountInstruction(
                tokenAccountPublicKey,
                toPublicKey,
                toPublicKey,
                [],
                TOKEN_PROGRAM_ID
              )
            );
            console.log('🚀 ~ transaction', transaction);

            const signature = await sendTransaction(transaction, connection);
            // Check Transaction has been completed
            await connection.confirmTransaction(signature, 'processed');

            saveTransaction(signature);
            return signature;
          }
        })
      );
      console.log('🚀 ~ signatures', signatures);

      onSuccess();
    } else {
      throw new Error('Missing Addresses for Kin on that Solana Network');
    }
  } catch (error) {
    console.log('🚀 ~ error', error);
    onFailure(error);
  }
}
