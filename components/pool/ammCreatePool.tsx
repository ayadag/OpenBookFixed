// export const CreatePool = () => {
//     return(
//         <div>Hello World</div>
//     )
// }

import {
  FC,
  useState,
} from 'react';

import { toBufferBE } from 'bigint-buffer';
import Decimal from 'decimal.js';

// import { BN } from 'bn.js';
// import BN from 'bn.js';
import { BN } from '@project-serum/anchor';
import { Liquidity } from '@raydium-io/raydium-sdk';

// import {
//   Keypair,
//   PublicKey,
// } from '@solana/web3.js';
import {
  connection,
  DEFAULT_TOKEN,
  PROGRAMIDS,
  wallet,
} from '../../config';
import { getWalletTokenAccount } from '../util/util';
import {
  ammCreatePool,
  getMarketInfo,
  getPubkeyFromStr,
} from './ammCP/ammCreatePool';

// const ZERO = new BN(0)
// type BN = typeof ZERO

// type CalcStartPrice = {
//   addBaseAmount: BN
//   addQuoteAmount: BN
// }
// const ZERO = new BN(0)
// type bn = typeof ZERO

// type CalcStartPrice = {
//   addBaseAmount: bn
//   addQuoteAmount: bn
// }

// type LiquidityPairTargetInfo = {
//   baseToken: Token
//   quoteToken: Token
//   targetMarketId: PublicKey
// }

// type WalletTokenAccounts = Awaited<ReturnType<typeof getWalletTokenAccount>>

// type TestTxInputInfo = LiquidityPairTargetInfo &
//   CalcStartPrice & {
//     startTime: number // seconds
//     walletTokenAccounts: WalletTokenAccounts
//     wallet: Keypair
// }

// export const ammCreateP: FC = () => {

  function calcNonDecimalValue(value: number, decimals: number): number {
    return Math.trunc(value * (Math.pow(10, decimals)))
  }

export const AmmCreatePool: FC = () => {

  const [marketIdS, setMarketIdS] = useState('');

  // const id = getPubkeyFromStr(marketIdS)
  //       if (!id) {
  //           console.log("Invalid market id")
  //           return
  //       }

  async function howToUse() {
    // const baseToken = DEFAULT_TOKEN.USDC // USDC
    // const quoteToken = DEFAULT_TOKEN.RAY // RAY
    const baseToken = DEFAULT_TOKEN.SALD // USDC
    const quoteToken = DEFAULT_TOKEN.sol // RAY
    // const targetMarketId = Keypair.generate().publicKey
    // const targetMarketId = web3.Keypair.fromSecretKey(Uint8Array.from(bs58.decode("F6Abrndt3sWNreVesrb6nzqNiPfCpeY6qesTzPPbyqyd")))
    // const targetMarketId= getPubkeyFromStr("F6Abrndt3sWNreVesrb6nzqNiPfCpeY6qesTzPPbyqyd")
    // const targetMarketId= getPubkeyFromStr("BzcDHvKWD4LyW4X1NUEaWLBaNmyiCUKqcd3jXDRhwwAG")
    // const targetMarketId= getPubkeyFromStr("21TJSyureafPDtKd82dqwfns8XNJ9dfhhAWQYKtrnSf4")
    // const targetMarketId= getPubkeyFromStr("7k9CxPBSmdLr1HHvsp55RKJN3uy8ayTJALciqq54qY2A")
    // const targetMarketId= getPubkeyFromStr("4cDFyfxhn1hD5WxdiJGDCMkpFCXm7g63LEAzsgt6bzWX")
    // const targetMarketId= getPubkeyFromStr("9iLzCPDnbSTaYrBqA7MWqCHSKMJByofGzvMph7Y8yeim")
    // const targetMarketId= getPubkeyFromStr("4cDFyfxhn1hD5WxdiJGDCMkpFCXm7g63LEAzsgt6bzWX")

    const id = getPubkeyFromStr(marketIdS)
        if (!id) {
            console.log("Invalid market id")
            return
        }
    const targetMarketId= id;
    
    
    if (targetMarketId  == null) {
      return { Err: " not found" }
    } 
  
    const marketState = await getMarketInfo(targetMarketId).catch((getMarketInfoError) => { console.log({ getMarketInfoError }); return null })
    if (!marketState) {
      return { Err: "market not found" }
    } 
    console.log(marketState)
    
    // const addBaseAmount = new BN(2)
    // const addQuoteAmount = new BN(1)
    // const baseAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(input.baseMintAmount, baseMintState.decimals).toString()), 8))
    const bAmo = 10 //baseMintAmount
    const bDes = 9  //decimals
    const qAmo = 0.1 //quoteMintAmount
    const qDes = 9  //decimals
    const addBaseAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(bAmo, bDes).toString()), 8))
    const addQuoteAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(qAmo, qDes).toString()), 8))
  
    // const startTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // start from 7 days later
    // const startTime = Math.floor(Date.now() / 1000) - 4;
    const startTime = Math.floor(Date.now() / 1000);
  
    if(!wallet){
      return {Err: "The wallet notfound"}
    }
    
    const walletTokenAccounts = await getWalletTokenAccount(connection, wallet.publicKey)
  
    /* do something with start price if needed */
    console.log('pool price', new Decimal(addBaseAmount.toString()).div(new Decimal(10 ** baseToken.decimals)).div(new Decimal(addQuoteAmount.toString()).div(new Decimal(10 ** quoteToken.decimals))).toString())
    
    const poolId = Liquidity.getAssociatedId({ marketId: targetMarketId, programId: PROGRAMIDS.AmmV4 })
    console.log("poolId: ",poolId.toBase58())
  
    // ammCreatePool({
    await ammCreatePool({
      startTime,
      addBaseAmount,
      addQuoteAmount,
      baseToken,
      quoteToken,
      targetMarketId,
      wallet,
      walletTokenAccounts,
    }).then(({ txids }) => {
      /** continue with txids */
      // const poolId = Liquidity.getAssociatedId({ marketId: marketInfo.marketId, programId: ammProgramId })
      console.log('txids', txids)
    })
  
  }

  
  
// export const ammCreateP: FC = () => {
// export const AmmCreatePool: FC = () => {

    return(
        <>
              <div>Create Pool2</div>
  
              <input
              type="text"
              className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Market Id"
              onChange={(e) => setMarketIdS(e.target.value)}
              />
  
              <button
              className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
              onClick={() => howToUse()}
              >
                  <span>Create Pool</span>
              </button>
        </>
    )
}
  