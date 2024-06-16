"use client";
// import { toBufferBE } from 'bigint-buffer';
// import Decimal from 'decimal.js';

// import { BN } from 'bn.js';
// import BN from 'bn.js';
// import { FC } from 'react';
import {
  BN,
  web3,
} from '@project-serum/anchor';
import {
  buildSimpleTransaction,
  InnerSimpleV0Transaction,
  Liquidity,
  Market as RayMarket,
  Token,
} from '@raydium-io/raydium-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SendOptions,
} from '@solana/web3.js';

import {
  addLookupTableInfo,
  makeTxVersion,
  PROGRAMIDS,
} from '../../../config';
import { getWalletTokenAccount } from '../../util/utils';

// const ZERO = new BN(0)
// type BN = typeof ZERO

// type CalcStartPrice = {
//   addBaseAmount: BN
//   addQuoteAmount: BN
// }
const ZERO = new BN(0)
type bn = typeof ZERO

type CalcStartPrice = {
  addBaseAmount: bn
  addQuoteAmount: bn
}

type LiquidityPairTargetInfo = {
  baseToken: Token
  quoteToken: Token
  targetMarketId: PublicKey
}

type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>
type TestTxInputInfo = LiquidityPairTargetInfo &
  CalcStartPrice & {
    startTime: number // seconds
    walletTokenAccounts: WalletTokenAccounts
    // wallet: Keypair
    publicKey: PublicKey
    // connection: web3.Connection
  }

export function calcNonDecimalValue(value: number, decimals: number): number {
    return Math.trunc(value * (Math.pow(10, decimals)))
  }

// function getKeypairFromStr(str: string): web3.Keypair | null {
//     try {
//       return web3.Keypair.fromSecretKey(Uint8Array.from(bs58.decode(str)))
//     } catch (error) {
//       return null
//     }
// }

export function getPubkeyFromStr(str?: string) {
  try {
    return new web3.PublicKey((str ?? "").trim())
  } catch (error) {
    return null
  }
}

export async function getMarketInfo(marketId: web3.PublicKey, connection: web3.Connection) {
  const marketAccountInfo = await connection.getAccountInfo(marketId).catch(() => null)
  if (!marketAccountInfo) throw "Market not found"

  try {
    return RayMarket.getLayouts(3).state.decode(marketAccountInfo.data)
  } catch (parseMeketDataError) {
    // log({ parseMeketDataError })
  }
  return null
}
  

export async function AmmCP(
    input: TestTxInputInfo, 
    connection: web3.Connection, 
    // publicKey: web3.PublicKey,
    // signTransaction: <T extends web3.VersionedTransaction | web3.Transaction>,
    signTransaction: WalletContextState["signTransaction"],
    sendTransaction: WalletContextState["sendTransaction"],
): Promise<{ txids: string[] | void }> {
  // -------- step 1: make instructions --------
  const initPoolInstructionResponse = await Liquidity.makeCreatePoolV4InstructionV2Simple({
    connection,
    programId: PROGRAMIDS.AmmV4,
    marketInfo: {
      marketId: input.targetMarketId,
      programId: PROGRAMIDS.OPENBOOK_MARKET,
    },
    baseMintInfo: input.baseToken,
    quoteMintInfo: input.quoteToken,
    baseAmount: input.addBaseAmount,
    quoteAmount: input.addQuoteAmount,
    startTime: new BN(Math.floor(input.startTime)),
    ownerInfo: {
      feePayer: input.publicKey,
      wallet: input.publicKey,
      tokenAccounts: input.walletTokenAccounts,
      useSOLBalance: true,
    },
    associatedOnly: false,
    checkCreateATAOwner: true,
    makeTxVersion,
    // feeDestinationId: new PublicKey('7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5'), // only mainnet use this
    feeDestinationId: new PublicKey('3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR'), // only devnet use this
  })
  console.log("initPoolInstructionResponse",initPoolInstructionResponse)
  console.log("initPoolInstructionResponse.innerTransactions",initPoolInstructionResponse.innerTransactions)
  
  // return { txids: await buildAndSendTx(initPoolInstructionResponse.innerTransactions) }
  // return { txids: await buildAndSendTx(initPoolInstructionResponse.innerTransactions, { skipPreflight: true }) }

  // try {
  return { txids: await BuildAndSendTx2(
    initPoolInstructionResponse.innerTransactions, 
    connection, 
    input.publicKey, 
    signTransaction,
    sendTransaction,
    // { skipPreflight: true }) 
    { skipPreflight: false }) 
   }
  // } catch(error){
    // console.log(error)
  // }


}

export async function BuildAndSendTx2(
    innerSimpleV0Transaction: InnerSimpleV0Transaction[], 
    connection: web3.Connection, 
    publicKey: web3.PublicKey, 
    signTransaction: WalletContextState["signTransaction"],
    sendTransaction: WalletContextState["sendTransaction"],
    Options?: SendOptions
) {
    // const { publicKey } = useWallet();
    // const { connection } = useConnection();
    if(!publicKey){return console.log("publicKey not found")}

    const willSendTx = await buildSimpleTransaction({
      connection,
      makeTxVersion,
      payer: publicKey,
      innerTransactions: innerSimpleV0Transaction,
      addLookupTableInfo: addLookupTableInfo,
    })

    // if(!signAllTransactions){return console.log("signAllTransactions undefine")}
    // const signed = signAllTransactions(willSendTx)
  
    return await SendTx(connection, willSendTx, signTransaction, sendTransaction, Options)
    // return sendTransaction(signed, connection)
  }


export async function SendTx(
    connection: web3.Connection,
    // payer: Keypair | Signer,
    txs: (web3.VersionedTransaction | web3.Transaction)[],
    // sendTransaction: (transaction: web3.VersionedTransaction | web3.Transaction, connection: web3.Connection, options?: SendTransactionOptions | undefined) => Promise<...>,
    signTransaction: WalletContextState["signTransaction"],
    sendTransaction: WalletContextState["sendTransaction"],
    Options?: SendOptions,
  ): Promise<string[]> {
    // const { signTransaction, sendTransaction } = useWallet();
    if(!signTransaction){return ["signAllTransactions undefine"]}
    
    const txids: string[] = [];
    // if(!signTransaction){return txids}

    for (const iTx of txs) {
      if (iTx instanceof web3.VersionedTransaction) {
        // iTx.sign([payer]);
        // txids.push(await connection.sendTransaction(iTx, options));
        // if(!signTransaction){return console.log("signAllTransactions undefine")}
        signTransaction(iTx);
        txids.push(await sendTransaction(iTx, connection, Options));
      } else {
        // txids.push(await connection.sendTransaction(iTx, [payer], options));
        txids.push(await sendTransaction(iTx, connection, Options));
      }
    }
    return txids;
}