"use client";
// import CreatePool from '../../../components/createPool';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import ReactTooltip from 'react-tooltip';

import CreatePoolForm from '../../../components/createPool/CreatePoolForm';
import Layout from '../../../components/layouts/layout';

export type CreatePoolFormValues = {
    marketId: string;
    baseAmount: number;
    qouteAmount: number;
}



const Pool = () => {
    // const { register, handleSubmit, watch, setValue, formState, clearErrors } =
    const { register, handleSubmit, formState } =
    useForm<CreatePoolFormValues>();

    const handleCreateMarket: SubmitHandler<CreatePoolFormValues> = async (
        data
      ) => {
        console.log("data", data)
    }

    return(
        <Layout>
            {/* <CreatePool/> */}
            <>
      <div className="space-y-4 mb-6">
        <div>
          <h1 className="text-2xl text-slate-200">Create Market</h1>
          <p className="text-sm text-slate-400">
            You must set a custom RPC endpoint to create a market. There is no development fees therefore I am not 
            providing a base RPC endpoint. You can set a custom RPC endpoint by clicking the settings icon and pasting the URL there.
          </p>

        </div>
        <form onSubmit={handleSubmit(handleCreateMarket)}>
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
                  <CreatePoolForm register={register} formState={formState}/>
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
    </>
        </Layout> 
    )
}
export default Pool;