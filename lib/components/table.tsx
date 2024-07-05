"use client"
import { Flex, Center, Heading, Table, Thead, Tbody, Tr, Td, Checkbox, Img, Progress, Spinner, Text, FlexProps,  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, TableHeadProps, useOutsideClick, TooltipProps, HStack, IconButton, Tooltip, Icon, } from "@chakra-ui/react";
import React, { PropsWithChildren, ReactNode, useRef } from "react";
import { ChangeEvent, useEffect, useState } from "react";
import { IconType } from "react-icons";

interface DataTableProps {
    loading?: boolean,
    error?: string | null,
    headerRow?: JSX.Element[],
    hideHeader?: boolean,
    contentRowList: { rowId: string; rowElements: JSX.Element[], rowBackground?: string, nestedContent?: any }[] | null,
    onCheckCheckbox?: (selectedItems: string[]) => void,
    flexProps?: FlexProps
    checkbox?: boolean,
    disableTopLoading?: boolean,
    disableFirstColumnSticky?: boolean,
    enableLastColumnSticky?: boolean,
    disableStripeColor?: boolean,
    headerProps?: TableHeadProps
}

const DataTable = ({ 
    loading = false, 
    error = null, 
    headerRow, 
    hideHeader = false,
    contentRowList, 
    onCheckCheckbox = (selected) => {}, 
    flexProps, 
    disableTopLoading = false,
    disableFirstColumnSticky = false, 
    enableLastColumnSticky = false, 
    disableStripeColor = false,
    headerProps,
    checkbox = true 
}: DataTableProps) => {
    const [selectedItems, setSelectedItems] = useState<string[]>([])

    useEffect(() => {
        if(loading) setSelectedItems([])
    }, [loading])

    const getLoader = (show: boolean) => {
        return <Progress visibility={show ? "visible" : "hidden"} colorScheme = "black" size='xs' isIndeterminate />
    }

    if(contentRowList) {
        const onCheckChangedForAll = (event: ChangeEvent<HTMLInputElement>) => {
            let selected: string[] = [];
            if(event.target.checked) selected = [...contentRowList.map((row) => row.rowId)]
            setSelectedItems(selected);
            onCheckCheckbox(selected);
        }
        const onCheckChanged = (event: ChangeEvent<HTMLInputElement>, id: string) => {
            let selected = [...selectedItems];
            if(event.target.checked) selected.push(id);
            else selected = selected.filter((item) => item != id);
            setSelectedItems(selected);
            onCheckCheckbox(selected);
        }

        if(contentRowList.length == 0) {
            return <Flex w = "100%" direction = "column">
                {disableTopLoading == false && getLoader(loading)}
                <Center my="50px" w = "100%">
                    <Heading size="md">No records found!</Heading>
                </Center>
            </Flex>
        }

        return (
            <Flex w = "100%" direction={"column"} overflow={"hidden"} overflowX = "auto" bg = 'white' {...flexProps}>
                {disableTopLoading == false && getLoader(loading)}
                <Table variant="unstyled" colorScheme = "whiteAlpha">
                    {
                        hideHeader == false && headerRow && headerRow?.length > 0 &&
                        <Thead bg = "white" borderBottom = "2px" borderColor = "brand.bgColor" {...(headerProps ?? {})}>
                            <Tr>
                                {
                                    headerRow.map((heading, index) => {
                                        if(index == 0) {
                                            return <Td position = {disableFirstColumnSticky ? "initial" : "sticky"} zIndex={1} bg = "white" left = "0px" key = {index}>
                                                {
                                                    checkbox ?
                                                    <Checkbox key = {index} borderColor = "brand.text" isIndeterminate = {selectedItems.length > 0 && selectedItems.length < contentRowList.length} isChecked = {selectedItems.length == contentRowList.length} onChange={onCheckChangedForAll} spacing="2rem" colorScheme="black" size="lg">
                                                        {heading}
                                                    </Checkbox> :
                                                    heading
                                                }
                                            </Td>
                                        }
                                        if(index == headerRow.length - 1) {
                                            return <Td position = {enableLastColumnSticky ? "sticky" : "initial"} bg = "white" zIndex={1} right = "0px" key = {index}>
                                                {heading}
                                            </Td>
                                        }
                                        return <Td key = {index}>{heading}</Td>
                                    })
                                }
                            </Tr>
                        </Thead>
                    }
                    <Tbody>
                        {
                            contentRowList.map((row, rowIndex) => {
                                return <React.Fragment key = {rowIndex}>
                                    <Tr key = {rowIndex} bg = {disableStripeColor == false && rowIndex%2 == 0? "#FAFAFA" : row.rowBackground ?? 'white'} transition={'all 250ms ease-in-out'}>
                                        {
                                            row.rowElements.map((content, index) => {
                                                if(index == 0) {
                                                    return <Td w = {content.props.w} position = {disableFirstColumnSticky ? "initial" : "sticky"} zIndex={1} bg = {disableStripeColor == false && rowIndex%2 == 0? "#FAFAFA" : row.rowBackground ?? 'white'} left = "0px" key = {index} transition={'all 250ms ease-in-out'}>
                                                        {
                                                            checkbox ?
                                                            <Checkbox key = {index} borderColor = "brand.text" isChecked = {selectedItems.indexOf(row.rowId) !== -1} onChange={(event) => onCheckChanged(event, row.rowId)} spacing="2rem" colorScheme="black" size="lg">
                                                                {content}
                                                            </Checkbox> :
                                                            content
                                                        }
                                                    </Td>
                                                }
                                                if(index == row.rowElements.length - 1) {
                                                    return <Td position = {enableLastColumnSticky ? "sticky" : "initial"} zIndex={1} bg = {disableStripeColor == false && rowIndex%2 == 0? "#FAFAFA" : row.rowBackground ?? 'white'} right = "0px" key = {index} transition={'all 250ms ease-in-out'}>
                                                        {content}
                                                    </Td>
                                                }
                                                return <Td key = {index}>{content}</Td>
                                            })
                                        }
                                    </Tr> 
                                    {row.nestedContent}
                                </React.Fragment>
                            })
                        }
                    </Tbody>
                </Table>
            </Flex>
        );
    } else {
        return (
            <Flex w = "100%" direction={"column"}>
                {disableTopLoading == false && getLoader(loading && error == null)}
                <Flex justifyContent={"center"} my="80px">
                    <Heading size="md">{error != null ? error : "Loading..."}</Heading>
                    <Spinner visibility={loading && error == null ? "visible" : "hidden"} ml = "20px" color= "black" size = "md" />
                </Flex>
            </Flex>
        );
    }
}

export default DataTable;

interface ActionsProps {
    onClickEdit?: (id: string) => void,
    onClickDelete?: (id: string) => void,
    dataId: string,
    isNotDeletable?: boolean,
    isNotEditable?: boolean,
    additionalButtons?: { 
        icon: IconType | JSX.Element, 
        isElement?: boolean,
        color?: string,
        toolTipLabel?: string,
        height?: string | string[], 
        width: string | string[], 
        isDisabled?: boolean,
        onClick: () => void ,
        'data-testid'?: string
    }[],
    'data-testid'?: string
}

export const ActionsComponent = ({ onClickEdit = () => {}, onClickDelete = () => {}, isNotDeletable = false, isNotEditable = false, dataId, additionalButtons, 'data-testid': testid = 'table_action' }: ActionsProps) => {
    return <Center>
        <HStack spacing = "12px">
            {
                additionalButtons?.map((e, index) => {
                    const isJSXElement = (React.isValidElement(e.icon) || typeof e.icon == 'function') && (React.isValidElement(e.icon) || e.icon.prototype.isReactComponent || String(e.icon).includes('return React.createElement'))
                    if(e.isElement) return <ResponsiveTooltip key = {index} p = '10px' borderRadius = '10px' hasArrow placement = 'auto-start' label = {e.toolTipLabel}>{e.icon as ReactNode}</ResponsiveTooltip>;
                    return <ResponsiveTooltip key = {index} p = '10px' borderRadius = '10px' hasArrow placement = 'auto-start' label = {e.toolTipLabel}>
                        <IconButton 
                            key = {index.toString()}
                            aria-label = {index.toString()}
                            variant = "ghost"
                            p = {0} 
                            borderRadius = "20px" 
                            size = "sm"
                            icon = {isJSXElement ? e.icon as any : <Icon w = {e.width ?? "15px"} h = {e.height ?? "15px"} as = {e.icon as IconType} />} 
                            onClick = {e.onClick}
                            color = {e.color}
                            isDisabled = {e.isDisabled}
                            data-testid = {`${testid}_${e["data-testid"] ?? `additional_button_${index}`}`}
                        />
                    </ResponsiveTooltip>
                })
            }
            {
                isNotEditable == false &&
                <IconButton 
                    aria-label = "editIcon"
                    variant = "ghost"
                    p = {0} 
                    borderRadius = "20px" 
                    size = "sm"
                    data-testid = {`${testid}_edit_button`}
                    icon = {<Img src = "/Edit.svg" />} 
                    onClick = {() => onClickEdit(dataId)}
                />
            }
            <IconButton 
                display = {isNotDeletable ? "none" : "flex"}
                aria-label = "deleteIcon"
                variant = "ghost"
                p = {0} 
                borderRadius = "20px" 
                size = "sm"
                data-testid = {`${testid}_delete_button`}
                icon = {<Img src = "/Delete.svg" />} 
                onClick = {() => onClickDelete(dataId)}
            />
        </HStack>
    </Center>
}

interface ResponsiveTooltipProps extends PropsWithChildren<any>, TooltipProps {}

export const ResponsiveTooltip = ({ children, isDisabled, ...restTooltipProps }: ResponsiveTooltipProps) => {
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    useOutsideClick({ ref: ref, handler: () => setOpen(false) })
    const onClose = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setOpen(false)
    }
    const onOpen = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setOpen(true)
    }
    const onToggle = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setOpen(!isOpen)
    }
    
    return (
        <Tooltip 
            isOpen = {isOpen}
            p = '10px' borderRadius = '10px' hasArrow
            {...restTooltipProps}
            eventListeners = {{ scroll: false }}
        >
            <div 
                ref={ref}
                onTouchEnd = {isDisabled ? undefined : onToggle} 
                onMouseEnter = {isDisabled ? undefined : onOpen} 
                onMouseLeave = {isDisabled ? undefined : onClose} 
            >
                {children}
            </div>
        </Tooltip>
    );
}