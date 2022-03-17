import BigNumber from 'bignumber.js';

import { TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';

import { createKinMemo, TransactionType } from '@kin-tools/kin-memo';

export type TransactionTypeName = 'Earn' | 'Spend' | 'P2P' | 'None';
export const transactionTypeNames: TransactionTypeName[] = [
  'Earn',
  'Spend',
  'P2P',
  'None',
];
export type SolanaNetwork = 'Mainnet' | 'Devnet';
export const solanaNetworks: SolanaNetwork[] = ['Mainnet', 'Devnet'];

export const solanaAddresses = {
  Mainnet: {
    kinMint: 'kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6',
    memoV1ProgramId: 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo',
    memoV2ProgramId: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
  },
  Devnet: {
    kinMint: '',
    memoV1ProgramId: '',
    memoV2ProgramId: '',
  },
};

function kinToQuarks(amount: string): BigNumber {
  const b = new BigNumber(amount).decimalPlaces(5, BigNumber.ROUND_DOWN);
  return b.multipliedBy(1e5);
}

interface GenerateMemoInstruction {
  memoContent: string;
  memoVersion: number;
  solanaNetwork: SolanaNetwork;
}
export function generateMemoInstruction({
  memoContent,
  memoVersion = 1,
  solanaNetwork,
}: GenerateMemoInstruction): TransactionInstruction {
  console.log('🚀 ~ generateMemoInstruction', memoContent, memoVersion);
  const memoProgramId =
    memoVersion === 1
      ? solanaAddresses[solanaNetwork].memoV1ProgramId
      : solanaAddresses[solanaNetwork].memoV2ProgramId;
  if (!memoProgramId) throw new Error('No Memo Program Id!');

  return new TransactionInstruction({
    keys: [],
    programId: new PublicKey(memoProgramId),
    data: Buffer.from(memoContent),
  });
}
interface GenerateTransferInstruction {
  from: PublicKey;
  fromTokenAccount: PublicKey;
  toTokenAccount: PublicKey;
  amount: string;
}
export async function generateTransferInstruction({
  from,
  fromTokenAccount,
  toTokenAccount,
  amount,
}: GenerateTransferInstruction) {
  console.log('🚀 ~ generateTransferInstruction', amount);

  // Amount
  const quarks = kinToQuarks(amount);

  // Instruction
  return createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    from,
    Number(quarks),
    [],
    TOKEN_PROGRAM_ID
  );
}

interface GenerateKRETransactionInstructions {
  type: TransactionTypeName;
  appIndex: number;
  from: PublicKey;
  fromTokenAccount: PublicKey;
  toTokenAccount: PublicKey;
  amount: string;
  solanaNetwork: SolanaNetwork;
}

export async function generateKRETransactionInstructions({
  type = 'None',
  appIndex,
  from,
  fromTokenAccount,
  toTokenAccount,
  amount,
  solanaNetwork,
}: GenerateKRETransactionInstructions) {
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
    from,
    fromTokenAccount,
    toTokenAccount,
    amount,
  });

  return [appIndexMemoInstruction, transferInstruction];
}
