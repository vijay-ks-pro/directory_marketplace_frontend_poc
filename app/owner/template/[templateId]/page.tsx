import { Template } from "@/lib/components/listing_template_builder/builder_types";
import EditTemplatePage from "@/lib/pages/edit_template";
import axiosClient from "@/lib/utils/axios";
import { getHeaderOrigin } from "@/lib/utils/utill_methods";
import { Flex } from "@chakra-ui/react";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic'

interface PageProps {
    params: {
        templateId: string
    }
}

const getTemplate = async (templateId: string): Promise<Template> => {
    const origin = getHeaderOrigin(headers())
    try {
        const res = await axiosClient.get(`/owner/listing_template/${templateId}`, { headers: { origin } });
        if(res.data && res.data.success) {
            return res.data.data;
        }
    } catch(error) {}
    return { name: '', data: [], widgetData: [] }
}

export default async function EditTemplate({ params }: PageProps) {
    const template = await getTemplate(params.templateId)

    return (
        <Flex w = '100%' direction={'column'}>
            <EditTemplatePage 
                template={template}
                templateId={params.templateId}
            />
        </Flex>
    );
}
