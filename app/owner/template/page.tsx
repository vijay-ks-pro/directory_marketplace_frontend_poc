import AppLayout from "@/lib/app/app_layout";
import OwnerHeader from "@/lib/components/owner_header";
import LinkButton from "@/lib/components/link_button";
import TemplateListTable from "@/lib/pages/template_list_table";
import axiosClient from "@/lib/utils/axios";
import { getHeaderOrigin } from "@/lib/utils/utill_methods";
import { Box, Text, Flex, Heading, Center } from "@chakra-ui/react";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'

export type TemplateMinimal = {
    _id: string, 
    name: string,
    createdAt: string
}

const getTemplateList = async (): Promise<TemplateMinimal[]> => {
    const origin = getHeaderOrigin(headers())
    try {
        const res = await axiosClient.get('/owner/listing_template', { headers: { origin } });
        if(res.data && res.data.success) {
            return res.data.data;
        }
    } catch(error: any) {
        console.log('api error on page: /owner/template', error?.response?.data)
    }
    return [];
}

export default async function TemplateList() {
    const templateList = await getTemplateList();

    return (
        <AppLayout>
            <OwnerHeader />
            <Flex px = {['10px', '10px', '0px', '0px', '0px']} mt = '100px' w = '100%' direction={'column'}>
                <Flex w = "100%" alignItems = "center" flexDir = "row" justifyContent = "space-between">
                    <Heading fontSize="18px">Template List</Heading>
                    <LinkButton label = '+ Create Template' href='/owner/template/create' />
                </Flex>
                <Flex mt="20px">
                    <Box
                        w = "100%"
                        border = "1px"
                        boxShadow = "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px"
                        borderColor = "brand.borderColor"
                        borderRadius = "10px"
                    >
                        <TemplateListTable templateList={templateList} />
                    </Box>
                </Flex>
            </Flex>
        </AppLayout>
    );
}