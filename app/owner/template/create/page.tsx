import CreateTemplatePage from "@/lib/pages/create_template";
import { Flex } from "@chakra-ui/react";

export const dynamic = 'force-dynamic'

export default async function CreateTemplate() {

    return (
        <Flex w = '100%' direction={'column'}>
            <CreateTemplatePage />
        </Flex>
    );
}
