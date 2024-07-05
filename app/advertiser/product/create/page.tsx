import { TemplateMinimal } from "@/app/owner/template/page";
import CreateProductPage from "@/lib/pages/create_product";
import axiosClient from "@/lib/utils/axios";
import { getHeaderOrigin } from "@/lib/utils/utill_methods";
import { Flex } from "@chakra-ui/react";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'

const getTemplateList = async (): Promise<TemplateMinimal[]> => {
    const origin = getHeaderOrigin(headers())
    try {
        const res = await axiosClient.get('/advertiser/listing_template', { headers: { origin } });
        if(res.data && res.data.success) {
            return res.data.data;
        }
    } catch(error) {}
    return [];
}

export default async function CreateProduct() {
    const templateList = await getTemplateList();

    return (
        <Flex w = '100%' direction={'column'}>
            <CreateProductPage templateList={templateList} />
        </Flex>
    );
}
