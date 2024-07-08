"use client"
import { TemplateMinimal } from "@/app/owner/template/page";
import DataTable, { ActionsComponent } from "../components/table";
import { Text,  Center, Flex, Button, FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";
import { getFormatedPastDateTime } from "../utils/utill_methods";
import { useRouter } from "next/navigation";
import ListingTemplateBuilder from "../components/listing_template_builder/builder";
import { Template } from "../components/listing_template_builder/builder_types";
import axiosClient from "../utils/axios";
import { ChangeEvent, useRef, useState } from "react";

type TemplateFormProps = {
    onSubmit: (data: Template) => void,
    initialData?: Template,
    isSubmitting?: boolean,
}

const TemplateForm = ({ initialData, isSubmitting, onSubmit }: TemplateFormProps) => {
    const [data, setData] = useState({ name: initialData?.name ?? '', nameError: false });
    const builderSubmitTrigger = useRef<{ getFormData: () => Omit<Template, 'name'> } | null>(null);

    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ name: event.target.value, nameError: event.target.value.trim() == '' }));
    }

    const validate = () => {
        const temp: typeof data = JSON.parse(JSON.stringify(data));
        temp.nameError = temp.name.trim() == '';
        setData(temp);
        return temp.nameError != false;
    }

    const onClickSave = async () => {
        if(validate()) return ;
        const template = builderSubmitTrigger.current?.getFormData();
        if(template == null) return ;
        const submitData: Template = { name: data.name, ...template };
        onSubmit(submitData);
        return submitData;
    }

    return (
        <Flex w = '100%' direction={'column'} mt = '100px' gap = '20px' px = {['20px', '20px', '20px', '50px', '50px']}>
            <Flex zIndex={999} h = '70px' w = '100vw' bg = 'white' position={'fixed'} top = {'0px'} left = {'0px'} alignItems={'center'} justifyContent={'flex-end'} px = '20px' boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px'}>
                <Button onClick={onClickSave} isLoading = {isSubmitting} maxH = '40px' colorScheme='black' px = '30px'>Save</Button>
            </Flex>
            <Flex w = '100%' h = '100%' p = '20px' bg = 'white' borderRadius={'12px'} boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}>
                <FormControl isInvalid = {data.nameError}>
                    <FormLabel>Template name</FormLabel>
                    <Input placeholder = 'Ex. Template 1' value={data.name} onChange={onChangeName} />
                    <FormErrorMessage ml = '10px'>Template name is required!</FormErrorMessage>
                </FormControl>
            </Flex>
            <ListingTemplateBuilder 
                ref = {builderSubmitTrigger}
                onSubmit = {() => {}}
                initialData={initialData}
            />
        </Flex>
    );
}

export default TemplateForm;