import { ProductMinimal } from "@/app/advertiser/product/page";
import { Flex, Heading } from "@chakra-ui/react";
import ProductCard from "../components/product_card";
import AppLayout from "../app/app_layout";
import ListingRenderrerRenderrer from "../components/listing_renderrer/listing_renderrer";
import { ProductFull } from "@/app/product/[productId]/page";

type ProductPageProps = {
    product: ProductFull | null
}

const ProductPage = ({ product }: ProductPageProps) => {
    return (
        <AppLayout rootProps={{ bg: 'white' }}>
            {
                product == null &&
                <Flex w = '100%' py = '49vh' bg = 'white' borderRadius={'12px'} justifyContent={'center'}>
                    <Heading size = 'sm' textAlign={'center'} m = '0px'>Something went wrong!</Heading>
                </Flex>
            }
            {
                product && 
                <Flex w = '100%' my = '100px'>
                    <ListingRenderrerRenderrer template={product.template} listingData={product.templateAnswer} />
                </Flex>
            }
        </AppLayout>
    );
}

export default ProductPage;