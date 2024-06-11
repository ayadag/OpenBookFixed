// export class baseRay {
//   public h = "hello world"
// }

import { toBufferBE } from 'bigint-buffer';

// import { BaseSpl } from "./baseSpl";
// import { createSyncNativeInstruction } from '@solana/spl-token'
// import { EVENT_QUEUE_LENGTH, ORDERBOOK_LENGTH, REQUEST_QUEUE_LENGTH, getVaultOwnerAndNonce } from "./orderbookUtils";
// import { DexInstructions, Market, MARKET_STATE_LAYOUT_V2, MARKET_STATE_LAYOUT_V3 } from "@openbook-dex/openbook";
// import { _MARKET_STAT_LAYOUT_V1 } from "@openbook-dex/openbook/lib/market";
import {
  BN,
  web3,
} from '@project-serum/anchor';
import {
  Liquidity,
  LiquidityAssociatedPoolKeys,
  LiquidityPoolKeys,
  Market as RayMarket,
  SPL_ACCOUNT_LAYOUT,
  TxVersion,
} from '@raydium-io/raydium-sdk';

// import fs from 'fs';
// import {
//   getAssociatedTokenAddressSync,
//   // MintLayout,
//   // NATIVE_MINT,
//   // TOKEN_PROGRAM_ID,
// } from '@solana/spl-token-3';
// import { NATIVE_MINT } from '@solana/spl-token-2';
// import { PublicKey, } from '@solana/web3.js';

// const NATIVE_MINT = new PublicKey("So11111111111111111111111111111111111111112") 
const NATIVE_MINT = new web3.PublicKey("So11111111111111111111111111111111111111112") 

console.log("NATIVE_MINT",NATIVE_MINT)

const TOKEN_PROGRAM_ID = new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") 

console.log("TOKEN_PROGRAM_ID", TOKEN_PROGRAM_ID)

// import { BaseRayInput } from './types';

// type BaseRayInput = {
//   rpcEndpointUrl: string
// }

// import useSerumMarketAccountSizes from "./getMarketAccountSizes";
// import { Result } from "./types";
// import { calcNonDecimalValue } from './utils';
function calcNonDecimalValue(value: number, decimals: number): number {
  return Math.trunc(value * (Math.pow(10, decimals)))
}

// import { ENV } from "../constants";

// export const RAYDIUM_AMM_PROGRAM = new web3.PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
// const _OPEN_BOOK_DEX_PROGRAM = "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"
// export type CreateMarketInput = {
//   baseMint: web3.PublicKey,
//   quoteMint: web3.PublicKey
//   tickers: {
//     lotSize: number,
//     tickSize: number
//   }
// }

// export type AddLiquidityInput = {
//   user: web3.PublicKey
//   poolKeys: LiquidityPoolKeys,
//   baseMintAmount: number | BN,
//   quoteMintAmount: number | BN,
//   fixedSide: 'base' | 'quote'
// }
// export type RemoveLiquidityInput = {
//   user: web3.PublicKey
//   poolKeys: LiquidityPoolKeys,
//   amount: number,
// }
// export type BuyFromPoolInput = {
//   poolKeys: LiquidityPoolKeys,
//   amountIn: TokenAmount
//   amountOut: TokenAmount
//   user: web3.PublicKey
//   fixedSide: SwapSide
//   tokenAccountIn: web3.PublicKey,
//   tokenAccountOut: web3.PublicKey
// }
export type CreatePoolInput = {
  baseMint: web3.PublicKey,
  quoteMint: web3.PublicKey,
  marketId: web3.PublicKey,
  baseMintAmount: number,
  quoteMintAmount: number,
}
// export type ComputeBuyAmountInput = {
//   poolKeys: LiquidityPoolKeys,
//   user: web3.PublicKey
//   amount: number,
//   inputAmountType: 'send' | 'receive',
//   buyToken: 'base' | 'quote',
//   /** default (1 %) */
//   slippage?: Percent
// }

// export type ComputeAnotherAmountInput = {
//   poolKeys: LiquidityPoolKeysV4,
//   amount: number
//   /** default( `true` ) */
//   isRawAmount?: boolean
//   /** default( `Percent(1, 100)` = 1%) */
//   slippage?: Percent,
//   fixedSide: 'base' | 'quote',
// }







let cachedPoolKeys: Map<string, LiquidityPoolKeys>;

function addPoolKeys(poolInfo: LiquidityAssociatedPoolKeys, marketState: any) {
    const { authority, baseDecimals, baseMint, baseVault, id, lookupTableAccount, lpDecimals, lpMint, lpVault, marketAuthority, marketId, marketProgramId, marketVersion, openOrders, programId, quoteDecimals, quoteMint, quoteVault, targetOrders, version, withdrawQueue, } = poolInfo
    const { baseVault: marketBaseVault, quoteVault: marketQuoteVault, eventQueue: marketEventQueue, bids: marketBids, asks: marketAsks } = marketState
    const res: LiquidityPoolKeys = {
      baseMint,
      quoteMint,
      quoteDecimals,
      baseDecimals,
      authority,
      baseVault,
      quoteVault,
      id,
      lookupTableAccount,
      lpDecimals,
      lpMint,
      lpVault,
      marketAuthority,
      marketId,
      marketProgramId,
      marketVersion,
      openOrders,
      programId,
      targetOrders,
      version,
      withdrawQueue,
      marketAsks,
      marketBids,
      marketBaseVault,
      marketQuoteVault,
      marketEventQueue,
    }
    cachedPoolKeys.set(id.toBase58(), res)
  }



async function createPool (input: CreatePoolInput, user: web3.PublicKey) {
  const connection = new web3.Connection("https://api.devnet.solana.com", { commitment: "confirmed", confirmTransactionInitialTimeout: 60000 })
  const ammProgramId = new web3.PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8")
  const feeDestinationId = new web3.PublicKey("3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR")
  // const orderBookProgramId = new web3.PublicKey("EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj")
  // let cacheIxs = []
  // const cachedPoolKeys = new Map();
  // const pools = new Map();

  // const reInit = () => cacheIxs = []

  // reInit()

  const userBaseAta = new web3.PublicKey("6vgZNorE36XPYvpGYVYSwXvnQiWAJYCDkfeVHKvPrMeS")
  const userQuoteAta = new web3.PublicKey("2nB4UbHGuHx66mtZ2xEmC84Fy6szHJuDSJBvMJzYKjcn")
  console.log(userBaseAta, userQuoteAta)
  
  // let [baseMintAccountInfo, quoteMintAccountInfo, marketAccountInfo, userBaseAtaInfo, userQuoteAtaInfo] = await this.connection.getMultipleAccountsInfo([input.baseMint, input.quoteMint, input.marketId, userBaseAta, userQuoteAta]).catch(() => [null, null, null, null])
  let [userBaseAtaInfo, userQuoteAtaInfo] = await connection.getMultipleAccountsInfo([userBaseAta, userQuoteAta]).catch(() => [null, null, null, null])
  const [baseMintAccountInfo, quoteMintAccountInfo, marketAccountInfo] = await connection.getMultipleAccountsInfo([input.baseMint, input.quoteMint, input.marketId]).catch(() => [null, null, null, null])

  if (!baseMintAccountInfo || !quoteMintAccountInfo || !marketAccountInfo) throw "AccountInfo not found"
  if (input.baseMint.toBase58() != NATIVE_MINT.toBase58() && !userBaseAtaInfo) throw "Don't have enought tokens"
  else {
    if (input.baseMint.toBase58() == NATIVE_MINT.toBase58()) {
      const todo = web3.PublicKey.default
      const buf = Buffer.alloc(SPL_ACCOUNT_LAYOUT.span)
      SPL_ACCOUNT_LAYOUT.encode({
        mint: NATIVE_MINT,
        amount: new BN(0),
        isNative: new BN(1),
        owner: user,
        closeAuthority: todo,
        closeAuthorityOption: 1,
        delegate: todo,
        delegatedAmount: new BN(1),
        delegateOption: 1,
        isNativeOption: 1,
        state: 1
      }, buf)
      userBaseAtaInfo = {
        data: buf,
      } as any
    }
  }

  if (input.quoteMint.toBase58() != NATIVE_MINT.toBase58() && !userQuoteAtaInfo) throw "Don't have enought tokens"
    else {
      if (input.quoteMint.toBase58() == NATIVE_MINT.toBase58()) {
        const todo = web3.PublicKey.default
        const buf = Buffer.alloc(SPL_ACCOUNT_LAYOUT.span)
        SPL_ACCOUNT_LAYOUT.encode({
          mint: NATIVE_MINT,
          amount: new BN(0),
          isNative: new BN(1),
          owner: user,
          closeAuthority: todo,
          closeAuthorityOption: 1,
          delegate: todo,
          delegatedAmount: new BN(1),
          delegateOption: 1,
          isNativeOption: 1,
          state: 1
        }, buf)
        userQuoteAtaInfo = {
          data: buf,
        } as any
      }
    }

    // const baseMintState = MintLayout.decode(baseMintAccountInfo.data);
    // const quoteMintState = MintLayout.decode(quoteMintAccountInfo.data);

    const baseMintState ={
      decimals: 9
    }
    const quoteMintState ={
      decimals: 9
    }
    ////////ayad//////////
    console.log("MintLayout.decode",baseMintState,quoteMintState)
    // const marketState = RayMarket.getLayouts(3).state.decode(marketAccountInfo.data)
    const marketInfo = {
      marketId: input.marketId,
      programId: marketAccountInfo.owner
    }
    const baseMintInfo = {
      mint: input.baseMint,
      decimals: baseMintState.decimals
    }
    const quoteMintInfo = {
      mint: input.quoteMint,
      decimals: quoteMintState.decimals
    }
    const baseAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(input.baseMintAmount, baseMintState.decimals).toString()), 8))
    const quoteAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(input.quoteMintAmount, quoteMintState.decimals).toString()), 8))
    // const quoteAmount = new BN(calcNonDecimalValue(input.quoteMintAmount, quoteMintState.decimals))

    const poolInfo = Liquidity.getAssociatedPoolKeys({
      version: 4,
      marketVersion: 3,
      marketId: marketInfo.marketId,
      baseMint: baseMintInfo.mint,
      quoteMint: quoteMintInfo.mint,
      baseDecimals: baseMintInfo.decimals,
      quoteDecimals: quoteMintInfo.decimals,
      programId: ammProgramId,
      marketProgramId: marketInfo.programId,
    })
    const marketState = RayMarket.getLayouts(3).state.decode(marketAccountInfo.data)
    addPoolKeys(poolInfo, marketState);

    const startTime = new BN(Math.trunc(Date.now() / 1000) - 4)

    const createPoolIxs = (await Liquidity.makeCreatePoolV4InstructionV2Simple({
      marketInfo,
      baseMintInfo,
      quoteMintInfo,
      baseAmount,
      quoteAmount,
      associatedOnly: true,
      checkCreateATAOwner: true,
      connection: connection,
      feeDestinationId: feeDestinationId,
      makeTxVersion: TxVersion.LEGACY,
      ownerInfo: {
        feePayer: user,
        tokenAccounts: [
          { accountInfo: SPL_ACCOUNT_LAYOUT.decode(userBaseAtaInfo!.data), programId: TOKEN_PROGRAM_ID, pubkey: userBaseAta },
          { accountInfo: SPL_ACCOUNT_LAYOUT.decode(userQuoteAtaInfo!.data), programId: TOKEN_PROGRAM_ID, pubkey: userQuoteAta }
        ],
        wallet: user,
        useSOLBalance: true
      },
      programId: ammProgramId,
      startTime
      // computeBudgetConfig: { microLamports: 250_000, units: 8000_000 },
    })).innerTransactions

    const ixs: web3.TransactionInstruction[] = []
    const signers: web3.Signer[] = []
    // ixs.push(...createPoolIxs.instructions)
    // signers.push(...createPoolIxs.signers)
    // for (let ix of createPoolIxs) {
    for (const ix of createPoolIxs) {
      ixs.push(...ix.instructions)
      signers.push(...ix.signers)
    }
    return { ixs, signers, poolId: Liquidity.getAssociatedId({ marketId: marketInfo.marketId, programId: ammProgramId }), baseAmount, quoteAmount, baseDecimals: poolInfo.baseDecimals, quoteDecimals: poolInfo.quoteDecimals }

}

export default createPool;
