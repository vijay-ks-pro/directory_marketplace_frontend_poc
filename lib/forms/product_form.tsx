"use client"
import { TemplateMinimal } from "@/app/owner/template/page";
import { Text,  Center, Flex, FormControl, FormLabel, Input, FormErrorMessage, Select, Button, Heading, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Template } from "../components/listing_template_builder/builder_types";
import axiosClient from "../utils/axios";
import TemplateFormRenderrer from "../components/template_form/template_form";
import { TemplateAnswer } from "../components/template_form/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import PriceInput from "../components/inputs/price_input";
import { getNumberFromString } from "../utils/utill_methods";
import { Product } from "@/app/advertiser/product/page";

type ProductFormProps = {
    templateList: TemplateMinimal[],
    onSubmit: (data: Product) => void,
    initialData?: Product,
    isSubmitting?: boolean
}

const ProductForm = ({ templateList, onSubmit, initialData, isSubmitting }: ProductFormProps) => {
    const [template, setTemplate] = useState<Template>({ name: '', data: [], widgetData: [] });
    const [isTemplateFetching, setTemplateFetching] = useState(false);
    const [data, setData] = useState({ name: initialData?.name ?? '', template: initialData?.template ?? '', price: initialData?.price ?? 0, nameError: false, templateError: false, priceError: false })
    const formRenderrerSubmitTrigger = useRef<{ getFormData: () => TemplateAnswer } | null>(null);

    useEffect(() => {
        if(initialData) {
            fetchTemplate(initialData.template)
            setData({ name: initialData?.name ?? '', template: initialData?.template ?? '', price: initialData?.price ?? 0, nameError: false, templateError: false, priceError: false })
        }
    }, [initialData])

    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, name: event.target.value, nameError: event.target.value.trim() == '' }));
    }

    const onChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
        let value: null | number = 0;
        if(event.target.value != '') { value = getNumberFromString(event.target.value) ?? 0 }
        setData(prev => ({ ...prev, price: value, priceError: value == 0 }));
    }

    const onChangTemplate = (event: ChangeEvent<HTMLSelectElement>) => {
        setData(prev => ({ ...prev, template: event.target.value, templateError: event.target.value.trim() == '' }));
        fetchTemplate(event.target.value);
    }

    const fetchTemplate = async (id: string) => {
        setTemplateFetching(true)
        try {
            const res = await axiosClient.get(`/advertiser/listing_template/${id}`);
            if(res.data && res.data.success) {
                setTemplate(res.data.data)
            }
        } catch(error) {}
        setTemplateFetching(false)
    }
    
    const validate = () => {
        const temp: typeof data = JSON.parse(JSON.stringify(data));
        temp.nameError = temp.name.trim() == '';
        temp.priceError = temp.name.trim() == '';
        temp.templateError = temp.name.trim() == '';
        setData(temp);
        return temp.nameError != false || temp.priceError != false || temp.templateError != false;
    }

    const onClickSave = () => {
        if(validate()) return ;
        const templateAnswer = formRenderrerSubmitTrigger.current?.getFormData();
        if(templateAnswer == null) return ;
        onSubmit({
            name: data.name,
            price: data.price,
            template: data.template,
            templateAnswer: templateAnswer
        });
    }

    return (
        <Flex w = '100%' direction={'column'} py = '100px' px = {['20px', '20px', '20px', '50px', '50px']} gap = '20px'>
            <Flex zIndex={999} h = '70px' w = '100%' bg = 'white' position={'fixed'} top = {'0px'} left = {'0px'} alignItems={'center'} justifyContent={'flex-end'} px = '20px' boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px'}>
                <Button onClick = {onClickSave} isLoading = {isSubmitting} maxH = '40px' colorScheme='black' px = '30px'>Save</Button>
            </Flex>
            <Flex w = '100%' direction={'column'} p = '20px' gap = '10px' bg = 'white' borderRadius={'12px'} boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}>
                <FormControl isInvalid = {data.nameError}>
                    <FormLabel>Product name</FormLabel>
                    <Input placeholder = 'Ex. Product 1' value={data.name} onChange={onChangeName} />
                    <FormErrorMessage ml = '10px'>Product name is required!</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid = {data.priceError}>
                    <FormLabel>Product price</FormLabel>
                    <PriceInput 
                        currentPrice={data.price}
                        onChange={onChangePrice}
                    />
                    <FormErrorMessage ml = '10px'>Product price is required!</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid = {data.templateError}>
                    <FormLabel>Product template</FormLabel>
                    <Select placeholder = 'Choose template' value={data.template} onChange={onChangTemplate} >
                        {
                            templateList.map(item => {
                                return <option key = {item._id} value = {item._id}>{item.name}</option>
                            })
                        }
                    </Select>
                    <FormErrorMessage ml = '10px'>Product template is required!</FormErrorMessage>
                </FormControl>
            </Flex>
            <Flex w = '100%' direction={'column'} p = '20px' gap = '10px' bg = 'white' borderRadius={'12px'} boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}>
                {
                    isTemplateFetching ?
                    <Flex w = '100%' py = '50px' bg = 'white' borderRadius={'12px'} justifyContent={'center'}>  
                        <Spinner thickness="3px" size = 'lg' />
                    </Flex> :
                    template.data.some(e => e.columns.some(e => e.widgets.length > 0)) == false && 
                    <Flex w = '100%' py = '50px' bg = 'white' borderRadius={'12px'} justifyContent={'center'}>
                        <Heading size = 'sm' textAlign={'center'} m = '0px'>Template has no widgets!</Heading>
                    </Flex>
                }
                {
                    template.data.some(e => e.columns.some(e => e.widgets.length > 0)) &&
                    <TemplateFormRenderrer 
                        ref = {formRenderrerSubmitTrigger}
                        onSubmit = {() => {}}
                        initialData = {initialData?.templateAnswer ?? []}
                        template={template}
                    />
                }
            </Flex>
        </Flex>
    );
}

export default ProductForm;