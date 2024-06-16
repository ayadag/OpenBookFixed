"use client";
import { toBufferBE } from 'bigint-buffer';
import Decimal from 'decimal.js';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import ReactTooltip from 'react-tooltip';

import {
  BN,
  web3,
} from '@project-serum/anchor';
// import { Liquidity, SPL_ACCOUNT_LAYOUT, Market as RayMarket, LiquidityPoolKeys, LiquidityAssociatedPoolKeys, Token, TOKEN_PROGRAM_ID } from '@raydium-io/raydium-sdk';
import {
  Liquidity,
  SPL_ACCOUNT_LAYOUT,
  Token,
  TOKEN_PROGRAM_ID,
} from '@raydium-io/raydium-sdk';
import {
  getAssociatedTokenAddressSync,
  MintLayout,
  NATIVE_MINT,
} from '@solana/spl-token-3';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';

import CreatePoolForm from '../../../components/createPool/CreatePoolForm';
import Layout from '../../../components/layouts/layout';
import {
  AmmCP,
  calcNonDecimalValue,
  getMarketInfo,
  getPubkeyFromStr,
} from '../../../components/pool/ammCP/ammCP';
import { getWalletTokenAccount } from '../../../components/util/util';
import { PROGRAMIDS } from '../../../config';

export type CreatePoolFormValues = {
    marketId: string;
    baseAmount: number;
    qouteAmount: number;
}


const Pool = () => {
    // const { register, handleSubmit, watch, setValue, formState, clearErrors } =
    const { register, handleSubmit, formState } =
        useForm<CreatePoolFormValues>();
    const { connection } = useConnection();
    const { publicKey, signTransaction, sendTransaction } = useWallet();
    const ammProgramId = new web3.PublicKey("HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8");
    // let cachedPoolKeys: Map<string, LiquidityPoolKeys>;

    if (!publicKey) {
        console.log("wallet not connected")
        return
    }

    // function addPoolKeys(poolInfo: LiquidityAssociatedPoolKeys, marketState: any) {
    //     const { authority, baseDecimals, baseMint, baseVault, id, lookupTableAccount, lpDecimals, lpMint, lpVault, marketAuthority, marketId, marketProgramId, marketVersion, openOrders, programId, quoteDecimals, quoteMint, quoteVault, targetOrders, version, withdrawQueue, } = poolInfo
    //     const { baseVault: marketBaseVault, quoteVault: marketQuoteVault, eventQueue: marketEventQueue, bids: marketBids, asks: marketAsks } = marketState
    //     const res: LiquidityPoolKeys = {
    //       baseMint,
    //       quoteMint,
    //       quoteDecimals,
    //       baseDecimals,
    //       authority,
    //       baseVault,
    //       quoteVault,
    //       id,
    //       lookupTableAccount,
    //       lpDecimals,
    //       lpMint,
    //       lpVault,
    //       marketAuthority,
    //       marketId,
    //       marketProgramId,
    //       marketVersion,
    //       openOrders,
    //       programId,
    //       targetOrders,
    //       version,
    //       withdrawQueue,
    //       marketAsks,
    //       marketBids,
    //       marketBaseVault,
    //       marketQuoteVault,
    //       marketEventQueue,
    //     }
    //     cachedPoolKeys.set(id.toBase58(), res)
    // }

    const handleCreatePool: SubmitHandler<CreatePoolFormValues> = async (
        data
    ) => {
        console.log("data", data)

        const id = getPubkeyFromStr(data.marketId)  //F6Abrndt3sWNreVesrb6nzqNiPfCpeY6qesTzPPbyqyd
        if (!id) {
            console.log("Invalid market id")
            return
        }
        const targetMarketId = id;
        if (targetMarketId == null) {
            return { Err: " not found" }
        }
        const marketState = await getMarketInfo(targetMarketId, connection).catch((getMarketInfoError) => { console.log({ getMarketInfoError }); return null })
        if (!marketState) {
            return { Err: "market not found" }
        }
        console.log("marketState: ",marketState)

        // const baseToken = DEFAULT_TOKEN.SALD // SALD
        // const quoteToken = DEFAULT_TOKEN.sol // sol

        const { baseMint, quoteMint } = marketState
        const userBaseAta = getAssociatedTokenAddressSync(baseMint, publicKey)
        const userQuoteAta = getAssociatedTokenAddressSync(quoteMint, publicKey)

        const [baseMintAccountInfo, quoteMintAccountInfo, marketAccountInfo] = await connection.getMultipleAccountsInfo([baseMint, quoteMint, targetMarketId]).catch(() => [null, null, null, null])
        let [userBaseAtaInfo, userQuoteAtaInfo] = await connection.getMultipleAccountsInfo([userBaseAta, userQuoteAta]).catch(() => [null, null, null, null])
        if (!baseMintAccountInfo || !quoteMintAccountInfo || !marketAccountInfo) throw "AccountInfo not found"
        if (baseMint.toBase58() != NATIVE_MINT.toBase58() && !userBaseAtaInfo) throw "Don't have enought tokens"
        else {
        if (baseMint.toBase58() == NATIVE_MINT.toBase58()) {
        const todo = web3.PublicKey.default
        const buf = Buffer.alloc(SPL_ACCOUNT_LAYOUT.span)
        SPL_ACCOUNT_LAYOUT.encode({
          mint: NATIVE_MINT,
          amount: new BN(0),
          isNative: new BN(1),
          owner: publicKey,
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
        if (quoteMint.toBase58() != NATIVE_MINT.toBase58() && !userQuoteAtaInfo) throw "Don't have enought tokens"
        else {
        if (quoteMint.toBase58() == NATIVE_MINT.toBase58()) {
        const todo = web3.PublicKey.default
        const buf = Buffer.alloc(SPL_ACCOUNT_LAYOUT.span)
        SPL_ACCOUNT_LAYOUT.encode({
          mint: NATIVE_MINT,
          amount: new BN(0),
          isNative: new BN(1),
          owner: publicKey,
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
        const baseMintState = MintLayout.decode(baseMintAccountInfo.data);
        const quoteMintState = MintLayout.decode(quoteMintAccountInfo.data);
        const marketInfo = {
            marketId: targetMarketId,
            programId: marketAccountInfo.owner
        }
        const baseMintInfo = {
            mint: baseMint,
            decimals: baseMintState.decimals
        }
        const quoteMintInfo = {
            mint: quoteMint,
            decimals: quoteMintState.decimals
        }
        const baseAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(data.baseAmount, baseMintState.decimals).toString()), 8))
        const qouteAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(data.qouteAmount, quoteMintState.decimals).toString()), 8))

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
        console.log("poolInfo: ",poolInfo)  //Pool info
        // const marketState2 = RayMarket.getLayouts(3).state.decode(marketAccountInfo.data)
        // addPoolKeys(poolInfo, marketState2);

        // const startTime = new BN(Math.trunc(Date.now() / 1000) - 4)

        // const bAmo = 10 //baseMintAmount
        // const bDes = 9  //decimals
        // const qAmo = 0.1 //quoteMintAmount
        // const qDes = 9  //decimals
        // const addBaseAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(bAmo, bDes).toString()), 8))
        // const addQuoteAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(qAmo, qDes).toString()), 8))
        const baseToken = new Token(TOKEN_PROGRAM_ID, baseMint, baseMintState.decimals);//new Token(TOKEN_PROGRAM_ID, new PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb'), 9, 'SALD', 'SALD'),
        const quoteToken = new Token(TOKEN_PROGRAM_ID, quoteMint, quoteMintState.decimals);

        const addBaseAmount= baseAmount;
        const addQuoteAmount= qouteAmount;
        const startTime = Math.floor(Date.now() / 1000);

        // if (!publicKey) {
        //     return console.log("publicKey not found")
        // }
        const walletTokenAccounts = await getWalletTokenAccount(connection, publicKey)

        /* do something with start price if needed */
        console.log('pool price', new Decimal(addBaseAmount.toString()).div(new Decimal(10 ** baseToken.decimals)).div(new Decimal(addQuoteAmount.toString()).div(new Decimal(10 ** quoteToken.decimals))).toString())

        const poolId = Liquidity.getAssociatedId({ marketId: targetMarketId, programId: PROGRAMIDS.AmmV4 })
        console.log("poolId: ", poolId.toBase58())

        await AmmCP({
            startTime,
            addBaseAmount,
            addQuoteAmount,
            baseToken,
            quoteToken,
            targetMarketId,
            publicKey,
            walletTokenAccounts,
        },
            connection,
            signTransaction,
            sendTransaction).then(({ txids }) => {
                /** continue with txids */
                // const poolId = Liquidity.getAssociatedId({ marketId: marketInfo.marketId, programId: ammProgramId })
                console.log('txids', txids)
            })

    }

    return (
        <>
            <Layout>
                <div className="space-y-4 mb-6">
                    <div>
                        <h1 className="text-2xl text-slate-200">Create Pool</h1>
                        <p className="text-sm text-slate-400">
                            You must set a custom RPC endpoint to create a market. There is no development fees therefore I am not
                            providing a base RPC endpoint. You can set a custom RPC endpoint by clicking the settings icon and pasting the URL there.
                        </p>

                    </div>
                    <form onSubmit={handleSubmit(handleCreatePool)}>
                        <div className="space-y-4">


                            <div className="bg-slate-800 border border-slate-700 px-4 py-5 shadow rounded-lg sm:p-6">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-slate-200">
                                            Tickers
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Configure the tick sizes, or lowest representable quantities
                                            of base and quote tokens.
                                        </p>
                                    </div>
                                    <div className="mt-5 space-y-4 md:col-span-2 md:mt-0">
                                        <CreatePoolForm register={register} formState={formState} />
                                    </div>
                                </div>
                            </div>


                            <div className="flex justify-end w-full">
                                <button className="w-full md:max-w-xs rounded-lg p-2 bg-cyan-500 hover:bg-cyan-600 transition-colors disabled:opacity-20">
                                    Create
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
                <ReactTooltip place="right" />
            </Layout>
        </>
    )
}
export default Pool;