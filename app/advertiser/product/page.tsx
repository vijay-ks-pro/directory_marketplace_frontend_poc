import AppLayout from "@/lib/app/app_layout";
import LinkButton from "@/lib/components/link_button";
import { TemplateAnswer } from "@/lib/components/template_form/types";
import ProductListTable from "@/lib/pages/product_list_table";
import axiosClient from "@/lib/utils/axios";
import { getHeaderOrigin } from "@/lib/utils/utill_methods";
import { Box, Text, Flex, Heading, Center } from "@chakra-ui/react";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'

export type Product = {
    name: string,
    price: number,
    template: string,
    templateAnswer: TemplateAnswer
}

export type ProductMinimal = {
    _id: string, 
    name: string,
    thumbnail: string,
    price: string,
    createdAt: string,
}

const getProductList = async (): Promise<ProductMinimal[]> => {
    const origin = getHeaderOrigin(headers())
    try {
        const res = await axiosClient.get('/advertiser/listing', { headers: { origin } });
        if(res.data && res.data.success) {
            return res.data.data;
        }
    } catch(error: any) {
        console.log('api error on page: /advertiser/product', error?.response?.data)
    }
    return [];
}

export default async function AdvertiserProductList() {
    const productList = await getProductList();

    return (
        <AppLayout>
            <Flex px = {['10px', '10px', '0px', '0px', '0px']} mt = '100px' w = '100%' direction={'column'}>
                <Flex w = "100%" alignItems = "center" flexDir = "row" justifyContent = "space-between">
                    <Heading fontSize="18px">Product List</Heading>
                    <LinkButton label = '+ Create Product' href='/advertiser/product/create' />
                </Flex>
                <Flex mt="20px">
                    <Box
                        w = "100%"
                        border = "1px"
                        boxShadow = "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
                        borderColor = "brand.borderColor"
                        borderRadius = "10px"
                    >
                        <ProductListTable productList={productList} />
                    </Box>
                </Flex>
            </Flex>
        </AppLayout>
    );
}