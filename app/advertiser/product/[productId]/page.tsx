import { TemplateAnswer } from "@/lib/components/template_form/types";
import EditProductPage from "@/lib/pages/edit_product";
import axiosClient from "@/lib/utils/axios";
import { Flex } from "@chakra-ui/react";
import { Product } from "../page";
import { TemplateMinimal } from "@/app/owner/template/page";
import { redirect } from "next/navigation";
import { getHeaderOrigin } from "@/lib/utils/utill_methods";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'

interface PageProps {
    params: {
        productId: string
    }
}

const getProduct = async (productId: string): Promise<Product | null> => {
    const origin = getHeaderOrigin(headers())
    try {
        const res = await axiosClient.get(`/advertiser/listing/${productId}`, { headers: { origin } });
        if(res.data && res.data.success) {
            return res.data.data;
        }
    } catch(error) {}
    return null;
}

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

export default async function EditProduct({ params }: PageProps) {
    const product = await getProduct(params.productId);
    const templateList = await getTemplateList();

    if(product == null) redirect('/advertiser/product');

    return (
        <Flex w = '100%' direction={'column'}>
            <EditProductPage 
                templateList={templateList} 
                product={product}
                productId={params.productId}
            />
        </Flex>
    );
}
