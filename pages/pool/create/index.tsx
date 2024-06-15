"use client";
import CreatePool from '../../../components/createPool';
import Layout from '../../../components/layouts/layout';

export type CreatePoolFormValues = {
    marketId: string;
    baseAmount: number;
    qouteAmount: number;
}


const Pool = () => {
    return(
        <Layout>
            <CreatePool/>
        </Layout> 
    )
}
export default Pool;