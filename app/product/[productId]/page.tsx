import { TemplateAnswer } from "@/lib/components/template_form/types";
import EditProductPage from "@/lib/pages/edit_product";
import axiosClient from "@/lib/utils/axios";
import { Flex } from "@chakra-ui/react";
import { TemplateMinimal } from "@/app/owner/template/page";
import { Product } from "../../advertiser/product/page";
import { Template } from "@/lib/components/listing_template_builder/builder_types";
import ProductPage from "@/lib/pages/product_page";
import { getHeaderOrigin } from "@/lib/utils/utill_methods";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'

export type ProductFull = Omit<Product, 'template'> & {
    template: Template
}

interface PageProps {
    params: {
        productId: string
    }
}

const getProduct = async (productId: string): Promise<ProductFull | null> => {
    const origin = getHeaderOrigin(headers())
    try {
        const res = await axiosClient.get(`/customer/listing/${productId}`, { headers: { origin: origin } });
        if(res.data && res.data.success) {
            return res.data.data;
        }
    } catch(error: any) {
        console.log('api error on page: /product/:productId', error?.response?.data)
    }
    return null;
}

export default async function ProductDetailedView({ params }: PageProps) {
    const product = await getProduct(params.productId);

    return (
        <ProductPage product={product} />
    );
}
