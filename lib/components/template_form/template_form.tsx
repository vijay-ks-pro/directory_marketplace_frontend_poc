import { Flex, Button, IconButton, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Heading } from "@chakra-ui/react";
import { Template, Widget } from "../listing_template_builder/builder_types";
import { ExpandableWidgetAnswerData, TemplateAnswer, WidgetAnswer } from "../template_form/types";
import WidgetForm, { getWidgetDefaultAnsweData } from "./widget_forms";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import WidgetSkeleton from "../listing_template_builder/widgets";

const getAnswerData = (templdate: Template, data: TemplateAnswer) => {
    return templdate.data.reduce((out, row) => {
        const widgetsWithAnswers: (WidgetAnswer & { type: Widget['type'] })[] = row.columns.flatMap(e => e.widgets.map(widget => {
            const answer = data.find(e => e.id == widget.id)?.data ?? getWidgetDefaultAnsweData(widget.type);
            return { id: widget.id, data: answer, type: widget.type }
        }));
        return [...out, ...widgetsWithAnswers];
    }, [] as (WidgetAnswer & { type: Widget['type'] })[])
}

type TemplateFormRenderrerProps = {
    template: Template,
    initialData: TemplateAnswer,
    onSubmit: (data: TemplateAnswer) => void
}

const TemplateFormRenderrer = React.forwardRef<{ getFormData: () => TemplateAnswer }, TemplateFormRenderrerProps>(({ template, initialData, onSubmit }, forwardedRef) => {
    const [answerData, setAnswerData] = useState<TemplateAnswer>(getAnswerData(template, initialData ?? []));
    const [editWidgetPopupData, setEditWidgetPopupData] = useState({ 
        isOpen: false, 
        widgetId: null as string | null, 
        widgetName: null as string | null, 
        widgetType: null as Widget['type'] | null, 
        data: null as WidgetAnswer['data'] | null,
        widgetData: null as Template['widgetData'][1] | null
    });
    const widgetDataSubmitTriggerRef = useRef<{ getFormData: () => WidgetAnswer['data'] | null }>(null);

    useEffect(() => setAnswerData(getAnswerData(template, initialData ?? [])), [template, initialData]);
    
    const onClickEditWidgetData = (widgetId: string) => {
        const widgetAnswerData = answerData.find(e => e.id == widgetId)!;
        const widgetData = template.widgetData.find(e => e.widgetId == widgetId) ?? null;
        const widgetName = widgetData && widgetData?.customWidgetName != null && widgetData?.customWidgetName.trim() != '' ? widgetData?.customWidgetName : widgetAnswerData.type;
        setEditWidgetPopupData({ 
            isOpen: true, 
            widgetId: widgetId, 
            widgetName: widgetName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') ,
            widgetType: widgetAnswerData.type,
            data: widgetAnswerData.data,
            widgetData: widgetData,
        });
    }

    const onClickSaveWidgetData = () => {
        const widgetData = widgetDataSubmitTriggerRef.current?.getFormData?.();
        if(widgetData == null) return ;
        setAnswerData(prev => prev.map(answer => answer.id == editWidgetPopupData.widgetId ? { ...answer, data: widgetData } : answer));
        onCloseEditWidgetPopup();
    }
    
    const onCloseEditWidgetPopup = () => setEditWidgetPopupData(prev =>  ({ ...prev, isOpen: false }))

    const onClickSubmit = () => {
        onSubmit(answerData);
        return answerData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [answerData, onClickSubmit]);

    return (
        <Flex w = '100%' direction = 'column'>
            <Modal scrollBehavior = 'inside' isOpen={editWidgetPopupData.isOpen} onClose={onCloseEditWidgetPopup} closeOnOverlayClick = {false}>
                <ModalOverlay />
                <ModalContent minW = {['0vw', '80vw', '80vw', '70vw', '1000px']}>
                    <ModalHeader>{editWidgetPopupData.widgetName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody m = '0px'>
                        <Flex w = '100%' flexWrap={'wrap'} gap = '15px' justifyContent={'center'}>
                            <WidgetForm 
                                initialAnswerData = {editWidgetPopupData.data} 
                                widgetData={editWidgetPopupData.widgetData}
                                type = {editWidgetPopupData.widgetType} 
                                forwardedRef = {widgetDataSubmitTriggerRef} 
                            />
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button maxH = '40px' mr={3} onClick={onCloseEditWidgetPopup}>Close</Button>
                        <Button maxH = '40px' bg = 'black' color = 'white' px = '30px' _hover = {{ bg: 'blackAlpha.700' }} onClick={onClickSaveWidgetData}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Flex 
                w = 'fit-content' minW = '100%' h = 'fit-content'
                direction={'column'} gap = '10px'
            >
                {
                    template.data.map((row, index) => {
                        return <Flex key = {row.id} w = '100%' gap = '15px' direction={['column', 'column', 'row', 'row', 'row']}>
                            {
                                row.columns.map((col, index) => {
                                    return <Flex key = {col.id} w = '100%' direction={'column'} gap = '15px'>
                                        {
                                            col.widgets.map((widget, index) => {
                                                const customName = template.widgetData.find(e => e.widgetId == widget.id)?.customWidgetName
                                                return <WidgetSkeleton 
                                                    key = {widget.id} 
                                                    widget = {widget.type}  
                                                    customWidgetName = {customName && customName.trim() != '' ? customName : null}
                                                    headerElement = {
                                                        <Flex mr = '10px' h = 'inherit' alignItems={'center'} gap = '5px'>
                                                            <IconButton 
                                                                onClick={() => onClickEditWidgetData(widget.id)} 
                                                                size = 'sm' variant={'ghost'} 
                                                                icon = {<Icon w = '17px' h = '17px' as = {MdEdit} />} 
                                                                aria-label="edit_widget_data_button" 
                                                            />
                                                        </Flex>
                                                    }
                                                />
                                            })
                                        }
                                    </Flex>
                                })
                            }
                        </Flex>
                    })
                }
            </Flex>
        </Flex>
    );
})

TemplateFormRenderrer.displayName = 'TemplateFormRenderrer';

export default TemplateFormRenderrer;