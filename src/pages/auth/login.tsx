"use client";

import LandingLayout from "@/components/Landing/Layout";
import Logo from "@/components/Logo";
import * as fire from "@/lib/firebase/client";
import { translateErrorCode } from "@/utils/firebase";
import {
    Anchor,
    Box,
    Button,
    Divider,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
    createStyles,
    rem
} from '@mantine/core';
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type FirebaseError } from "firebase/app";
import { updateCurrentUser } from "firebase/auth";
import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa6";
import { z } from "zod";

const useStyles = createStyles((theme) => ({
    wrapper: {
        // minHeight: rem(900),
        // backgroundSize: 'cover',
        // backgroundImage: 'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
    },

    form: {
        // borderRight: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]}`,
        // minHeight: rem(900),
        // maxWidth: rem(450),
        // paddingTop: rem(80),

        maxWidth: rem(450),
        margin: '0 auto',
        [theme.fn.smallerThan('sm')]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },
}));

const LoginPage: NextPage = () => {
    const router = useRouter()
    const { classes } = useStyles();
    const [loading, setLoading] = useState(false)
    const { auth } = fire.useAuth()
    const form = useForm({
        initialValues: {
            email: "",
            password: ""
        },
        validate: zodResolver(z.object({
            email: z.string().email("O email deve ser válido"),
            password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
        }))
    })

    const handleSubmit = (data: typeof form.values) => {
        setLoading(true)
        notifications.show({
            id: "login",
            title: "Login",
            message: "Fazendo login...",
            color: "cyan",
            autoClose: false,
            withCloseButton: false,
            loading: true
        })
        fire.signInWithEmailAndPassword(data.email, data.password).then(() => {
            notifications.update({
                id: "login",
                title: "Login",
                message: "Login feito com sucesso!",
                color: "green",
                autoClose: 3000,
                withCloseButton: true,
                loading: false
            })
            updateCurrentUser(auth, auth.currentUser)
                .then(() => {
                    router.push("/account").catch(() => {
                        notifications.update({
                            id: "login",
                            title: "Login",
                            message: "Erro ao redirecionar para a página de conta",
                            color: "red",
                            autoClose: 3000,
                            withCloseButton: true,
                            loading: false
                        })
                    })
                })
                .catch((error: FirebaseError) => {
                    notifications.update({
                        id: "login",
                        title: "Login",
                        message: translateErrorCode(error.code),
                        color: "red",
                        autoClose: 3000,
                        withCloseButton: true,
                        loading: false
                    })
                })

        }).catch((error: FirebaseError) => {
            notifications.update({
                id: "login",
                title: "Login",
                message: translateErrorCode(error.code),
                color: "red",
                autoClose: 3000,
                withCloseButton: true,
                loading: false
            })
        }).finally(() => {
            form.reset()
            setLoading(false)
        })
    }
    const handleErrors = (errors: typeof form.errors) => console.log(errors)
    const signInProvider = (provider: Parameters<typeof fire.signInWithProvider>[0]) => {
        return () => {
            setLoading(true)
            notifications.show({
                id: "login",
                title: "Login",
                message: "Fazendo login..",
                color: "cyan",
                autoClose: false,
                withCloseButton: false,
                loading: true
            })
            fire.signInWithProvider(provider).then((creds) => {
                auth.updateCurrentUser(creds.user)
                    .then(() => {
                        notifications.update({
                            id: "login",
                            title: "Login",
                            message: "Login feito com sucesso!",
                            color: "green",
                            autoClose: 5000,
                            withCloseButton: true,
                            loading: false
                        })
                    })
                    .catch((error: FirebaseError) => {
                        notifications.update({
                            id: "login",
                            title: "Login",
                            message: translateErrorCode(error.code),
                            color: "red",
                            autoClose: 5000,
                            withCloseButton: true,
                            loading: false
                        })
                    })
                updateCurrentUser(auth, auth.currentUser)
                    .then(() => {
                        location.href = "/account"
                    })
                    .catch((error: FirebaseError) => {
                        notifications.update({
                            id: "login",
                            title: "Login",
                            message: translateErrorCode(error.code),
                            color: "red",
                            autoClose: 5000,
                            withCloseButton: true,
                            loading: false
                        })
                    })
            }).catch((error: FirebaseError) => {
                notifications.update({
                    id: "login",
                    title: "Login",
                    message: translateErrorCode(error.code),
                    color: "red",
                    autoClose: 5000,
                    withCloseButton: true,
                    loading: false
                })
            }).finally(() => {
                form.reset()
                setLoading(false)
            })
        }
    }

    return (
        <LandingLayout>
            <div className={classes.wrapper}>
                <Paper className={classes.form} radius={0} p={0}>
                    <center>
                        <Logo height={200} width={200} />
                    </center>

                    <Title order={2} className={classes.title} ta="center" mt="md" mb={20}>
                        Bem-vindo ao AuroryCrypto! Continuar com
                    </Title>
                    {/* <Code>{JSON.stringify(session)}</Code>
                    <Code>{auth.currentUser?.uid}</Code> */}
                    <Box sx={{ zIndex: 5, position: "relative" }}>
                        <LoadingOverlay visible={loading} zIndex={10} />
                        <Box p="md">
                            <Group grow mb="md" mt="md">
                                <Button onClick={signInProvider("google")} radius={0} variant="light" leftIcon={<FaGoogle />}>Google</Button>
                                <Button onClick={signInProvider("microsoft")} radius={0} variant="light" leftIcon={<FaMicrosoft />}>Microsoft</Button>
                                <Button onClick={signInProvider("apple")} radius={0} variant="light" leftIcon={<FaApple />}>Apple</Button>
                            </Group>

                            <Divider label="Ou continuar com email" labelPosition="center" my="lg" />
                            <form onSubmit={form.onSubmit(handleSubmit, handleErrors)}>
                                <TextInput {...form.getInputProps('email')} label="Email" placeholder="hello@gmail.com" size="md" />
                                <PasswordInput {...form.getInputProps('password')} label="Senha" placeholder="Sua senha" mt="md" size="md" />
                                {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
                                <Button fullWidth mt="xl" size="md" type="submit">
                                    Login
                                </Button>
                            </form>
                        </Box>
                    </Box>

                    <Text ta="center" mt="md">
                        Não tem uma conta?{' '}
                        <Anchor component={Link} href="/auth/register" weight={700}>
                            Criar conta
                        </Anchor>
                    </Text>
                </Paper>
            </div>
        </LandingLayout>
    );
}

export default LoginPage;
