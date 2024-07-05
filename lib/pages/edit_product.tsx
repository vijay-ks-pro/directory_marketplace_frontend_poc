"use client"
import { TemplateMinimal } from "@/app/owner/template/page";
import { useRouter } from "next/navigation";
import axiosClient from "../utils/axios";
import ProductForm from "../forms/product_form";
import { Product } from "@/app/advertiser/product/page";
import AppLayout from "../app/app_layout";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";

type EditProductPageProps = {
    templateList: TemplateMinimal[],
    product: Product,
    productId: string,
}

const EditProductPage = ({ templateList, product, productId }: EditProductPageProps) => {
    const [isSubbmiting, setSubmitting] = useState(false);
    const router = useRouter();
    const toast = useToast();

    const onSubmit = async (data: Product) => {
        setSubmitting(true)
        try {
            const res = await axiosClient.put(`/advertiser/listing/${productId}`, { ...data, _id: productId });
            if(res.data && res.data.success) {
                router.replace('/advertiser/product')
            } else {
                setSubmitting(false)
                toast({
                    title: 'Something went wrong!',
                    status: 'error',
                    isClosable: true,
                })
            }
        } catch(error) {
            setSubmitting(false)
            toast({
                title: 'Something went wrong!',
                status: 'error',
                isClosable: true,
            })
        }
    }

    return (
        <AppLayout>
            <ProductForm 
                key={productId}
                onSubmit={onSubmit}
                templateList={templateList}
                initialData={product}
                isSubmitting={isSubbmiting}
            />
        </AppLayout>
    );
}

export default EditProductPage;