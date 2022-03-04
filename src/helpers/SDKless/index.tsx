import SecureLS from 'secure-ls';
import BigNumber from 'bignumber.js';

import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Connection, TransactionInstruction } from '@solana/web3.js';

import { solanaAddresses } from '../../constants';

// https://github.com/softvar/secure-ls
export const secureLocalStorage = new SecureLS();
console.log('🚀 ~ secureLocalStorage', secureLocalStorage);

declare global {
  interface Window {
    solana: any;
  }
}

function kinToQuarks(amount: string): BigNumber {
  const b = new BigNumber(amount).decimalPlaces(5, BigNumber.ROUND_DOWN);
  return b.multipliedBy(1e5);
}

interface GenerateMemoInstruction {
  memoContent: string;
  solanaNetwork: string;
  memoVersion: number;
}
export function generateMemoInstruction({
  memoContent,
  solanaNetwork,
  memoVersion = 1,
}: GenerateMemoInstruction): TransactionInstruction {
  console.log('🚀 ~ generateMemoInstruction', memoContent, memoVersion);
  let memoProgramId;
  if (solanaNetwork === 'Mainnet') {
    memoProgramId =
      memoVersion === 1
        ? solanaAddresses[solanaNetwork].memoV1ProgramId
        : solanaAddresses[solanaNetwork].memoV2ProgramId;
  } else {
    throw new Error('Missing Addresses for Kin on that Solana Network');
  }

  return new TransactionInstruction({
    keys: [],
    programId: new PublicKey(memoProgramId),
    data: Buffer.from(memoContent),
  });
}
interface GenerateTransferInstruction {
  connection: Connection;
  from: PublicKey;
  to: string;
  amount: string;
  solanaNetwork: string;
}
export async function generateTransferInstruction({
  connection,
  from,
  to,
  amount,
  solanaNetwork,
}: GenerateTransferInstruction) {
  console.log('🚀 ~ generateTransferInstruction', from.toBase58(), to, amount);
  if (solanaNetwork === 'Mainnet' || solanaNetwork === 'Devnet') {
    const mint = new PublicKey(solanaAddresses[solanaNetwork].kinMint);
    // From
    const fromTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      from,
      { mint }
    );
    const fromTokenAccount = fromTokenAccounts?.value[0]?.pubkey;
    // To
    const toPublicKey = new PublicKey(to);
    const toTokenAccounts = await connection.getParsedTokenAccountsByOwner(
      toPublicKey,
      { mint }
    );

    const toTokenAccount = toTokenAccounts?.value[0]?.pubkey;
    if (!toTokenAccount) throw new Error('No Token Account!');

    // Amount
    const quarks = kinToQuarks(amount);

    // Instruction
    return Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount,
      toTokenAccount,
      from,
      [],
      Number(quarks)
    );
  } else {
    throw new Error('Solana network not supported');
  }
}
