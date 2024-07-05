"use client"
import { Button, Flex, Text } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import LinkButton from "./link_button";
import { deleteCookie } from "../utils/utill_methods";
import { useRouter } from "next/navigation";

const OwnerHeader = () => {
    const router = useRouter();

    const onClickLogout = () => {
        deleteCookie('owner_auth_token');
        localStorage.removeItem('owner_auth');
        router.replace('/');
    }
    
    return (
        <Flex zIndex={999} h = '70px' w = '100%' bg = 'white' gap = '20px' position={'fixed'} top = {'0px'} left = {'0px'} alignItems={'center'} justifyContent={'flex-end'} px = '20px' boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px'}>
            <LinkButton label = 'Home' href='/' />
            <Button onClick={onClickLogout} p = {['8px', '15px', '15px', '15px', '15px']} px = {['20px', '40px', '40px', '40px', '40px']} bg = 'black' _hover = {{ bg: 'blackAlpha.700' }} color = 'white' borderRadius={'8px'} fontWeight={'normal'}><Text m = 'auto'>Logout</Text></Button>
        </Flex>
    );
}

export default OwnerHeader;