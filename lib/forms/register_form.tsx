import { Flex, Text, Heading, FormControl, FormLabel, InputGroup, InputLeftElement, Icon, Input, FormErrorMessage, InputRightElement, IconButton, Alert, AlertIcon, CloseButton, Button, Select } from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { validateEmail } from "../utils/utill_methods";

type RegisterFormProps = {
    onSubmit: (data: { name: string, email: string, password: string, isSeller: boolean }) => void,
    registerLoading?: boolean,
    registerError?: string | null,
    onCloseRegisterError?: () => void
}

const RegisterForm = ({ registerError, registerLoading, onSubmit, onCloseRegisterError }: RegisterFormProps) => {
    const [data, setData] = useState({ name: '', email: '', password: '', isSeller: false, nameError: null as string | null, emailErr: null as string | null, passwordErr: null as string | null });
    const [showPass, setShowPass] = useState(false);

    const onChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const inputType = event.target.name == 'name' ? 'name' : event.target.name == 'email' ? 'email' : event.target.name == 'seller' ? 'seller' : 'password';

        switch(inputType) {
            case 'name': {
                setData(prev => ({
                    ...prev,
                    [inputType]: event.target.value,
                    nameError: event.target.value.trim() == '' ? 'Name is required!' : null
                }))
                break;
            }
            case 'email': {
                setData(prev => ({
                    ...prev,
                    [inputType]: event.target.value,
                    emailErr: event.target.value.trim() == '' ? 'Email is required!' : validateEmail(event.target.value) == false ? 'Invalid email!' : null
                }))
                break;
            }
            case 'password': {
                setData(prev => ({
                    ...prev,
                    [inputType]: event.target.value,
                    passwordErr: event.target.value.trim() == '' ? 'Password is required!' : null
                }))
                break;
            }
            case 'seller': {
                setData(prev => ({ ...prev, isSeller: event.target.value == 'yes' }))
                break;
            }
        }
    }

    const onRegister = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onSubmit({ name: data.name, email: data.email, password: data.password, isSeller: data.isSeller });
    }

    return (
        <form style={{ width: '100%' }}>
            <Flex w = '100%' direction={'column'} gap = '15px'>
                <Heading w = '100%' mb = '30px' textAlign={'center'}>Signup</Heading>
                <FormControl isInvalid = {data.emailErr != null}>
                    <FormLabel>Name</FormLabel>
                    <InputGroup>
                        <InputLeftElement mt = '3px'>
                            <Icon w = '20px' h = '20px' as = {MdPerson} />
                        </InputLeftElement>
                        <Input 
                            name = 'name' 
                            value = {data.name}
                            onChange = {onChangeInput}
                            placeholder="Ex. John"
                            autoComplete = "off"
                        />
                    </InputGroup>
                    <FormErrorMessage ml = '10px'>{data.nameError}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid = {data.emailErr != null}>
                    <FormLabel>Email</FormLabel>
                    <InputGroup>
                        <InputLeftElement mt = '3px'>
                            <Icon w = '20px' h = '20px' as = {MdEmail} />
                        </InputLeftElement>
                        <Input 
                            name = 'email' 
                            value = {data.email}
                            onChange = {onChangeInput}
                            placeholder="Ex. john@test.com"
                            autoComplete = "off"
                        />
                    </InputGroup>
                    <FormErrorMessage ml = '10px'>{data.emailErr}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid = {data.passwordErr != null}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <InputLeftElement mt = '1px'>
                            <Icon w = '20px' h = '20px' as = {MdLock} />
                        </InputLeftElement>
                        <Input 
                            name = 'password' 
                            type = {showPass ? 'text' : 'password'}
                            value = {data.password}
                            onChange = {onChangeInput}
                            autoComplete = "new-password"
                            placeholder="****"
                        />
                        <InputRightElement mt = '2px' mr = '5px'>
                            <IconButton 
                                aria-label="password_eye_icon"
                                size = 'sm' h = 'fit-content' py = '5px'
                                onClick={e => setShowPass(!showPass)}
                                icon = {<Icon w = '20px' h = '20px' as = {showPass ? IoMdEyeOff : IoMdEye} />}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage ml = '10px'>{data.passwordErr}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid = {data.emailErr != null}>
                    <FormLabel>Want to sell products?</FormLabel>
                    <Select 
                        name = 'seller' 
                        value = {data.isSeller ? 'yes' : 'no'}
                        onChange = {onChangeInput}
                    >
                        <option value = 'no'>No</option>
                        <option value = 'yes'>Yes</option>
                    </Select>
                    <FormErrorMessage ml = '10px'>{data.emailErr}</FormErrorMessage>
                </FormControl>
                {
                    registerError &&
                    <Alert mt = '20px' status='error' borderRadius={'10px'}>
                        <AlertIcon />
                        <Text fontSize={'lg'} w = '100%'>{registerError}</Text>
                        <CloseButton
                            alignSelf='flex-start'
                            right = '0px'
                            onClick={onCloseRegisterError}
                        />
                    </Alert>
                }
                <Button onClick={onRegister} isLoading = {registerLoading} mt = '30px' type = 'submit' color = 'white' bg = 'black' _hover = {{ bg: 'blackAlpha.600' }} _focus = {{ boxShadow: 'none', outline: 'none' }} _focusWithin = {{ boxShadow: 'none', outline: 'none' }}>Register</Button>
            </Flex>
        </form>
    );
}

export default RegisterForm;