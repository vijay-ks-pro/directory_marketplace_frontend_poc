import { ProductMinimal } from "@/app/advertiser/product/page";
import { Flex } from "@chakra-ui/react";
import ProductCard from "../components/product_card";
import AppLayout from "../app/app_layout";

type HomepageProps = {
    productList: ProductMinimal[]
}

const Homepage = ({ productList }: HomepageProps) => {
    return (
        <AppLayout>
            <Flex w = '100%' direction={'column'} gap = '10px' mt = '100px'>
                <Flex w = '100%' flexWrap={'wrap'} gap = '20px'>
                    {
                        productList.map(product => {
                            return <ProductCard 
                                key = {product._id}
                                data = {product}
                            />
                        })
                    }
                </Flex>
            </Flex>
        </AppLayout>
    );
}

export default Homepage;