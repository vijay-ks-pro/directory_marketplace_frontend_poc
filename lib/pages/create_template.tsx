"use client"
import { TemplateMinimal } from "@/app/owner/template/page";
import DataTable, { ActionsComponent } from "../components/table";
import { Text,  Center, Flex, Button, FormControl, FormLabel, Input, FormErrorMessage, useToast } from "@chakra-ui/react";
import { getFormatedPastDateTime } from "../utils/utill_methods";
import { useRouter } from "next/navigation";
import ListingTemplateBuilder from "../components/listing_template_builder/builder";
import { Template } from "../components/listing_template_builder/builder_types";
import axiosClient from "../utils/axios";
import { ChangeEvent, useRef, useState } from "react";
import TemplateForm from "../forms/listing_template_form";

type CreateTemplatePageProps = {
}

const CreateTemplatePage = ({}: CreateTemplatePageProps) => {
    const [isSubbmiting, setSubmitting] = useState(false);
    const router = useRouter();
    const toast = useToast()

    const onSubmit = async (data: Template) => {
        setSubmitting(true)
        try {
            const res = await axiosClient.post('/owner/listing_template', data);
            if(res.data && res.data.success) {
                router.replace('/owner/template')
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
        <TemplateForm 
            onSubmit={onSubmit}
            isSubmitting = {isSubbmiting}
        />
    );
}

export default CreateTemplatePage;