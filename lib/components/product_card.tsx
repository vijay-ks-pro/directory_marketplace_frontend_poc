"use client"
import { Flex, Text } from "@chakra-ui/react";
import NextImageWithFallback from "./image_with_fallback";
import { ProductMinimal } from "@/app/advertiser/product/page";
import { convertToPriceFormat } from "../utils/utill_methods";
import { useRouter } from "next/navigation";
import { IMAGE_BASE_URL } from "../app/app_constants";

type ProductCardProps = {
    data: ProductMinimal
}

const ProductCard = ({ data }: ProductCardProps) => {
    const router = useRouter()

    const onClick = () => {
        router.push(`/product/${data._id}`)
    }

    return (
        <Flex 
            w = '250px' h = '300px' as = 'button' 
            textAlign={'start'} onClick = {onClick} direction={'column'} 
            flexShrink={0} flexGrow={0} borderRadius={'12px'} bg = 'white' cursor={'pointer'} 
            boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}
            _hover = {{ boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;' }} 
            transition={'all 200ms ease-in-out'}
        >
            <Flex w = '100%' h = '50%' flexShrink={0} borderRadius={'12px'}>
                <Flex position={'relative'} w = {'100%'} h = {'100%'} borderRadius = {'12px'}>
                    <NextImageWithFallback 
                        src = {data.thumbnail.startsWith('http') ? data.thumbnail : `${IMAGE_BASE_URL}/${data.thumbnail}`} 
                        alt = 'image' 
                        fill style = {{ objectFit: 'cover', borderRadius: '12px' }} 
                        sizes='(max-width: 991px) 100vw, 49vw' 
                        loading='lazy'
                    />
                </Flex>
            </Flex>
            <Flex w = '100%' direction={'column'} h = 'auto' p = '10px' gap = '10px'>
                <Text fontSize={'lg'} fontWeight={'bold'}>{data.name}</Text>
                <Text fontWeight={'bold'}>Rs. {convertToPriceFormat(data.price)}</Text>
            </Flex>
        </Flex>
    );
}

export default ProductCard;