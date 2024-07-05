"use client"
import { Alert, AlertIcon, Button, CloseButton, Flex, Text, FormControl, FormErrorMessage, FormLabel, Heading, Icon, IconButton, Input, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react";
import { MdEmail, MdLock } from "react-icons/md";
import AppLayout from "../app/app_layout";
import { ChangeEvent, useState } from "react";
import { setCookie, validateEmail } from "../utils/utill_methods";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import axiosClient from "../utils/axios";
import { useRouter } from "next/navigation";
import LoginForm from "../forms/login_form";

const OwnerLoginPage = () => {
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null as string | null);
    const router = useRouter();

    const onSubmit = async (cred: { email: string, password: string }) => {
        setLoginError(null);
        setLoginLoading(true);
        try {
            const res = await axiosClient.post('/auth/owner/login', { email: cred.email, password: cred.password });
            if(res.data && res.data.success) {
                setCookie('owner_auth_token', res.data.data.token);
                localStorage.setItem('owner_auth', JSON.stringify(res.data.data.user));
                setTimeout(() => {
                    router.replace('/owner/template')
                    router.refresh()
                }, 100);
            } else if(res.data && res.data.statusCode == 'INVALID_CREDENTIALS') {
                setLoginError('Invalid Credentials!')
                setLoginLoading(false);
            }
        } catch(error) {
            console.log(error)
            setLoginLoading(false);
        }
    }

    return (
        <AppLayout>
            <Flex w = '100%' direction={'column'} minH = '100vh'>
                <Flex m = {['30px 0px 0px 0px', '30px 0px 0px 0px', 'auto', 'auto', 'auto']} w = {['100%', '100%', '500px', '500px', '500px']} minH = '400px' bg = 'white' py = '50px' px = '30px' borderRadius={'15px'}>
                    <LoginForm 
                        title = "Owner Login"
                        loginLoading = {loginLoading}
                        loginError = {loginError}
                        onCloseLoginError = {() => setLoginError(null)}
                        onSubmit = {onSubmit}
                    />
                </Flex>
            </Flex>
        </AppLayout>
    );
}

export default OwnerLoginPage;