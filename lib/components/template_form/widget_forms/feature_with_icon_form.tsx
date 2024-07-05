import { Flex } from "@chakra-ui/react";
import { FeatureWithIconWidgetAnswerData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { covertImageWidgetDataToStateDataType, getWidgetDefaultAnsweData } from ".";
import ImageFormListWithDND, { ConditionalImageItem } from "../../image_list_with_dnd";
import { v4 as uuidv4 } from 'uuid';
import UploadImagesContainer from "../../image-upload-container";

type FeatureWithIconFormProps = {
    initialData?: FeatureWithIconWidgetAnswerData,
    onSubmit: (data: FeatureWithIconWidgetAnswerData) => void
}

const FeatureWithIconForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, FeatureWithIconFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('FEATURE_WITH_ICON') as FeatureWithIconWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) })

    useEffect(() => setData({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('FEATURE_WITH_ICON') as FeatureWithIconWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) }), [initialData])

    const onChangeItemValue = (event: ChangeEvent<HTMLInputElement>, itemId: string, type: 'IMAGE_URL' | 'ADDITIONAL_FIELD_1' | 'ADDITIONAL_FIELD_2') => {
        setData(prev => ({
            list: prev.list.map(item => {
                if(item.id == itemId) {
                    const tempItem: typeof item = JSON.parse(JSON.stringify(item));
                    tempItem[type == 'IMAGE_URL' ? 'path' : 'additional_field_1'] = event.target.value;
                    return tempItem;
                }
                return item;
            })
        }))
    }

    const onRemoveItem = (itemId: string) => setData(prev => ({ ...prev, list: prev.list.filter(e => e.id != itemId) }));

    const onChangeList = (list: ConditionalImageItem<true, false>[]) => setData({ list: list as typeof data['list'] })

    const onClickAddNewItem = () => setData(prev => ({ ...prev, list: [...prev.list, { path: '', additional_field_1: '', additional_field_2: '', id: uuidv4() }] }));

    const onUploadComplete = (items: { path: string, id: string }[]) => setData(prev => ({ ...prev, list: [...prev.list, ...items.map(e => ({ path: e.path, additional_field_1: '', additional_field_2: '', id: e.id }))] }));

    const onClickSubmit = () => {
        const submitData: FeatureWithIconWidgetAnswerData = JSON.parse(JSON.stringify(data))
        submitData.list = data.list.filter(e => e.path.trim() != '').map(({ path, additional_field_1 }) => ({ path, feature: additional_field_1 }));
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data, onClickSubmit]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <ImageFormListWithDND<true, false>
                currentList={data.list}
                onChangeList={onChangeList}
                onChangeItemValue={onChangeItemValue} 
                onRemoveItem={onRemoveItem} 
                aditionalField1Label="Feature"
            />
            <UploadImagesContainer 
                showAddItemButton
                onClickAddItem={onClickAddNewItem}
                onUploadComplete={onUploadComplete}
            />
        </Flex>
    );
})

FeatureWithIconForm.displayName = 'FeatureWithIconForm';

export default FeatureWithIconForm;