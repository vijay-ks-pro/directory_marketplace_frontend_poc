import { Link, Flex, Text } from "@chakra-ui/react";
import NextLink from 'next/link'

const LinkButton = ({ href, label }: { href: string, label: string }) => {
    return (
        <Link as = {NextLink} href = {href} _hover={{}}>
            <Flex p = {['8px', '15px', '15px', '15px', '15px']} px = {['20px', '40px', '40px', '40px', '40px']} bg = 'black' _hover = {{ bg: 'blackAlpha.700' }} color = 'white' borderRadius={'8px'}>
                <Text m = 'auto'>{label}</Text>
            </Flex>
        </Link>
    );
}

export default LinkButton;