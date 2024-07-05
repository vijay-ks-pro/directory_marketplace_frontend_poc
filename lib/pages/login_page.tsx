"use client"
import { Button, Flex } from "@chakra-ui/react";
import AppLayout from "../app/app_layout";
import { useState } from "react";
import { setCookie } from "../utils/utill_methods";
import axiosClient from "../utils/axios";
import { useRouter } from "next/navigation";
import LoginForm from "../forms/login_form";
import RegisterForm from "../forms/register_form";

type LoginPageProps = {
    redirectTo: string | null
}

const LoginPage = ({ redirectTo }: LoginPageProps) => {
    const [formType, setFormType] = useState('LOGIN' as 'LOGIN' | 'REGISTER');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState(null as string | null);
    const router = useRouter();

    const onLogin = async (cred: { email: string, password: string }) => {
        setLoginError(null);
        setLoginLoading(true);
        try {
            const res = await axiosClient.post('/auth/customer/login', cred);
            if(res.data && res.data.success) {
                setCookie('auth_token', res.data.data.token);
                setCookie('role', res.data.data.user.role ?? 'CUSTOMER');
                localStorage.setItem('auth', JSON.stringify(res.data.data.user));
                setTimeout(() => {
                    router.replace(redirectTo ?? '/')
                    router.refresh()
                }, 100)
            } else if(res.data && res.data.statusCode == 'INVALID_CREDENTIALS') {
                setLoginError('Invalid Credentials!')
                setLoginLoading(false);
            } else {
                setLoginError('Something went wrong!')
                setLoginLoading(false);
            }
        } catch(error) {
            console.log(error)
            setLoginLoading(false);
        }
        
    }

    const onSignup = async (cred: { name: string, email: string, password: string, isSeller: boolean }) => {
        setLoginError(null);
        setLoginLoading(true);
        try {
            const res = await axiosClient.post('/auth/customer/register', cred);
            if(res.data && res.data.success) {
                setCookie('auth_token', res.data.data.token);
                setCookie('role', res.data.data.user.role ?? 'CUSTOMER');
                localStorage.setItem('auth', JSON.stringify(res.data.data.user));
                setTimeout(() => {
                    router.replace(redirectTo ?? '/')
                    router.refresh()
                }, 100)
            } else if(res.data && res.data.statusCode == 'USER_ALREADY_EXISTS') {
                setLoginError('Email already taken!')
                setLoginLoading(false);
            } else {
                setLoginError('Something went wrong!')
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
                <Flex direction={'column'} m = {['30px 0px 0px 0px', '30px 0px 0px 0px', 'auto', 'auto', 'auto']} gap = '30px' w = {['100%', '100%', '500px', '500px', '500px']} minH = '400px' bg = 'white' py = '50px' px = '30px' borderRadius={'15px'}>
                    {
                        formType == 'LOGIN' ?
                        <LoginForm 
                            title = "Login"
                            loginLoading = {loginLoading}
                            loginError = {loginError}
                            onCloseLoginError = {() => setLoginError(null)}
                            onSubmit = {onLogin}
                        /> :
                        <RegisterForm 
                            registerLoading = {loginLoading}
                            registerError = {loginError}
                            onCloseRegisterError = {() => setLoginError(null)}
                            onSubmit = {onSignup}
                        />
                    }
                    {
                        formType == 'LOGIN' ?
                        <Flex w = '100%' alignItems={'center'} justifyContent={'center'}>
                            {`Doesn't have account?`}
                            <Button onClick = {e => setFormType('REGISTER')} variant={'unstyled'} h = 'fit-content' p = '0px' color = '#0000EE' ml = '5px' _hover = {{ textDecor: 'underline' }}>Signup</Button>
                        </Flex> :
                        <Flex w = '100%' alignItems={'center'} justifyContent={'center'}>
                            {`Already have account?`}
                            <Button onClick = {e => setFormType('LOGIN')} variant={'unstyled'} h = 'fit-content' p = '0px' color = '#0000EE' ml = '5px' _hover = {{ textDecor: 'underline' }}>Login</Button>
                        </Flex>
                    }
                </Flex>
            </Flex>
        </AppLayout>
    );
}

export default LoginPage;