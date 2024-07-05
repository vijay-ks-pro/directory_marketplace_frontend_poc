import { Flex, Text, Heading, FormControl, FormLabel, InputGroup, InputLeftElement, Icon, Input, FormErrorMessage, InputRightElement, IconButton, Alert, AlertIcon, CloseButton, Button } from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { MdEmail, MdLock } from "react-icons/md";
import { validateEmail } from "../utils/utill_methods";

type LoginFormProps = {
    onSubmit: (data: { email: string, password: string }) => void,
    loginLoading?: boolean,
    loginError?: string | null,
    onCloseLoginError?: () => void,
    title: string
}

const LoginForm = ({ loginError, loginLoading, title, onSubmit, onCloseLoginError }: LoginFormProps) => {
    const [data, setData] = useState({ email: '', password: '', emailErr: null as string | null, passwordErr: null as string | null });
    const [showPass, setShowPass] = useState(false);

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const inputType = event.target.name == 'email' ? 'email' : 'password';

        switch(inputType) {
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
        }
    }

    const onLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onSubmit({ email: data.email, password: data.password });
    }

    return (
        <form style={{ width: '100%' }}>
            <Flex w = '100%' direction={'column'} gap = '15px'>
                <Heading w = '100%' mb = '30px' textAlign={'center'}>{title}</Heading>
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
                {
                    loginError &&
                    <Alert mt = '20px' status='error' borderRadius={'10px'}>
                        <AlertIcon />
                        <Text fontSize={'lg'} w = '100%'>{loginError}</Text>
                        <CloseButton
                            alignSelf='flex-start'
                            right = '0px'
                            onClick={onCloseLoginError}
                        />
                    </Alert>
                }
                <Button onClick={onLogin} isLoading = {loginLoading} mt = '30px' type = 'submit' color = 'white' bg = 'black' _hover = {{ bg: 'blackAlpha.600' }} _focus = {{ boxShadow: 'none', outline: 'none' }} _focusWithin = {{ boxShadow: 'none', outline: 'none' }}>Login</Button>
            </Flex>
        </form>
    );
}

export default LoginForm;