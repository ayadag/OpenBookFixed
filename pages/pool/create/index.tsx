"use client";
import { toBufferBE } from 'bigint-buffer';
import Decimal from 'decimal.js';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import ReactTooltip from 'react-tooltip';

import { BN } from '@project-serum/anchor';
import { Liquidity } from '@raydium-io/raydium-sdk';
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
import {
  DEFAULT_TOKEN,
  PROGRAMIDS,
} from '../../../config';

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

    const handleCreatePool: SubmitHandler<CreatePoolFormValues> = async (
        data
    ) => {
        console.log("data", data)
        const baseToken = DEFAULT_TOKEN.SALD // SALD
        const quoteToken = DEFAULT_TOKEN.sol // sol

        const id = getPubkeyFromStr(data.marketId)
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
        console.log(marketState)

        const bAmo = 10 //baseMintAmount
        const bDes = 9  //decimals
        const qAmo = 0.1 //quoteMintAmount
        const qDes = 9  //decimals
        const addBaseAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(bAmo, bDes).toString()), 8))
        const addQuoteAmount = new BN(toBufferBE(BigInt(calcNonDecimalValue(qAmo, qDes).toString()), 8))

        const startTime = Math.floor(Date.now() / 1000);

        if (!publicKey) {
            return console.log("publicKey not found")
        }
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