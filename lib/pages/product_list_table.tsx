"use client"
import DataTable, { ActionsComponent } from "../components/table";
import { Text,  Center, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import { convertToPriceFormat, getFormatedPastDateTime } from "../utils/utill_methods";
import { useRouter } from "next/navigation";
import { ProductMinimal } from "@/app/advertiser/product/page";
import { useState } from "react";
import axiosClient from "../utils/axios";

type ProductListTableProps = {
    productList: ProductMinimal[]
}

const ProductListTable = ({ productList }: ProductListTableProps) => {
    const [tableRows, setTableRows] = useState(productList);
    const [deleteProductId, setDeleteProductId] = useState(null as null | string);
    const [deleteProductLoading, setDeleteProductLoading] = useState(false);
    const router = useRouter();

    const onClickEditProduct = (productId: string) => {
        router.push(`/advertiser/product/${productId}`);
    }

    const onClickDeleteProduct = (ProductId: string) => setDeleteProductId(ProductId)

    const onConfirmDeleteProduct = async () => {
        setDeleteProductLoading(true);
        try {
            const res = await axiosClient.delete(`/advertiser/listing/${deleteProductId}`);
            if(res.data && res.data.success) {
                setTableRows(prev => prev.filter(item => item._id != deleteProductId));
                setDeleteProductId(null);
            }
        } catch(error) {}
        setDeleteProductLoading(false);
    }

    const getHeaderRow = () => {
        return [
            <Text key = {'product_name'} minW = {"50px"} fontSize="md" fontWeight="600" py={2}>Product Name</Text>,
            <Text key = {'price'} minW = {"100px"} fontSize="md" fontWeight="600">Price</Text>,
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
                    <Text key = {row._id} fontSize="md">{convertToPriceFormat(row.price)}</Text>,
                    <Text key = {row._id} fontSize="md">{getFormatedPastDateTime(row.createdAt)}</Text>,
                    <ActionsComponent key = {row._id} dataId = {row._id} onClickEdit={onClickEditProduct} onClickDelete={onClickDeleteProduct} />,
                ]
            }
        })
    }

    return (
        <>
            <AlertDialog
                isOpen={deleteProductId != null}
                onClose={() => setDeleteProductId(null)}
                leastDestructiveRef = {null as any}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete {productList.find(e => e._id == deleteProductId)?.name ?? 'Product'}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`Are you sure? You can't undo this action afterwards.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button onClick={() => setDeleteProductId(null)}>
                            Cancel
                        </Button>
                        <Button isLoading = {deleteProductLoading} colorScheme='red' onClick={onConfirmDeleteProduct} ml={3}>
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

export default ProductListTable;