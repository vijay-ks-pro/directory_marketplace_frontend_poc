"use client"
import { TemplateMinimal } from "@/app/owner/template/page";
import DataTable, { ActionsComponent } from "../components/table";
import { Text,  Center, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { getFormatedPastDateTime } from "../utils/utill_methods";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axiosClient from "../utils/axios";

type TemplateListTableProps = {
    templateList: TemplateMinimal[]
}

const TemplateListTable = ({ templateList }: TemplateListTableProps) => {
    const [tableRows, setTableRows] = useState(templateList);
    const [deleteTemplateId, setDeleteTemplateId] = useState(null as null | string);
    const [deleteTemplateLoading, setDeleteTemplateLoading] = useState(false);
    const router = useRouter();

    const onClickEditTemplate = (templateId: string) => {
        router.push(`/owner/template/${templateId}`);
    }

    const onClickDeleteTemplate = (templateId: string) => setDeleteTemplateId(templateId)

    const onConfirmDeleteTemplate = async () => {
        setDeleteTemplateLoading(true);
        try {
            const res = await axiosClient.delete(`/owner/listing_template/${deleteTemplateId}`);
            if(res.data && res.data.success) {
                setTableRows(prev => prev.filter(item => item._id != deleteTemplateId));
                setDeleteTemplateId(null);
            }
        } catch(error) {}
        setDeleteTemplateLoading(false);
    }

    const getHeaderRow = () => {
        return [
            <Text key = {'template_name'} minW = {"50px"} fontSize="md" fontWeight="600" py={2}>Template Name</Text>,
            <Text key = {'date'} minW = {"100px"} fontSize="md" fontWeight="600">Date</Text>,
            <Center key = {'actions'}><Text fontWeight="600">Actions</Text></Center>,
        ]
    }

    const getContentRows = () => {
        return tableRows.map((row, index) => {
            return {
                rowId: row._id,
                rowElements: [
                    <Text key = {row._id} py = {2} fontSize="md">{row?.name ?? '-'}</Text>,
                    <Text key = {row._id} fontSize="md">{getFormatedPastDateTime(row.createdAt)}</Text>,
                    <ActionsComponent key = {row._id} dataId = {row._id} onClickEdit={onClickEditTemplate} onClickDelete={onClickDeleteTemplate} />,
                ]
            }
        })
    }

    return (
        <>
            <AlertDialog
                isOpen={deleteTemplateId != null}
                onClose={() => setDeleteTemplateId(null)}
                leastDestructiveRef = {null as any}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete {templateList.find(e => e._id == deleteTemplateId)?.name ?? 'Template'}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`Are you sure? You can't undo this action afterwards.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button onClick={() => setDeleteTemplateId(null)}>
                            Cancel
                        </Button>
                        <Button isLoading = {deleteTemplateLoading} colorScheme='red' onClick={onConfirmDeleteTemplate} ml={3}>
                            Delete
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <DataTable 
                error={null} 
                loading = {true}
                headerRow={getHeaderRow()} 
                contentRowList={getContentRows()} 
                disableTopLoading
                flexProps = {{ borderBottomRadius: "10px", borderTopRadius: '10px' }}
            />
        </>
    );
}

export default TemplateListTable;