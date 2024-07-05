import { Flex } from "@chakra-ui/react";
import LinkButton from "@/lib/components/link_button";
import axiosClient from "@/lib/utils/axios";
import { ProductMinimal } from "./advertiser/product/page";
import { cookies, headers } from "next/headers";
import Homepage from "@/lib/pages/homepage";
import { getHeaderOrigin } from "@/lib/utils/utill_methods";

export const dynamic = 'force-dynamic'

const getProductList = async (): Promise<ProductMinimal[]> => {
    const origin = getHeaderOrigin(headers())
    try {
        const res = await axiosClient.get('/customer/listing', { headers: { origin: origin } });
        if(res.data && res.data.success) {
            return res.data.data;
        }
    } catch(error: any) {
        console.log('api error on page: /', error?.response?.data)
    }
    return [];
}

export default async function Home() {
    const productList = await getProductList();
    const authToken = cookies().get('auth_token');
    const isLoggedIn = authToken != null && authToken.value != null && authToken.value != '';

    return (
        <Flex w = '100%' direction={'column'}>
            <Flex zIndex={999} h = '70px' w = '100%' bg = 'white' gap = '20px' position={'fixed'} top = {'0px'} left = {'0px'} alignItems={'center'} justifyContent={'flex-end'} px = '20px' boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px'}>
                <LinkButton label = 'Owner' href='/owner/template' />
                <LinkButton label = 'Advertiser' href='/advertiser/product' />
                {
                    isLoggedIn == false ?
                    <LinkButton label = 'Login' href='/login' /> :
                    <LinkButton label = 'Logout' href='/logout' />
                }
            </Flex>
            <Homepage productList={productList} />
        </Flex>
    );
}
