"use client";

import { FaApple, FaGoogle, FaMicrosoft } from "react-icons/fa6";
import {
    Paper,
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Title,
    Text,
    Anchor,
    rem,
    Group,
    Divider,
    Code,
    LoadingOverlay,
    Overlay,
    Box,
} from '@mantine/core';
import LandingLayout from "@/components/Landing/Layout";
import { signInWithPopup, updateProfile } from "firebase/auth";
import * as fire from "@/lib/firebase/client"
import { NextPage } from "next";
import { api } from "@/utils/api";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { sleep, translateErrorCode } from "@/utils/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

import { useState } from "react";
import Logo from "@/components/Logo";

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
        paddingTop: rem(80),

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

const RegisterPage: NextPage = () => {
    const { classes } = useStyles();
    const { data: session } = api.auth.getSession.useQuery()
    const { auth } = fire.useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const form = useForm({
        initialValues: {
            name: "",
            email: "",
            password: ""
        },
        validate: zodResolver(z.object({
            name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
            email: z.string().email("O email deve ser válido"),
            password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
            confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
        }).refine(data => data.password === data.confirmPassword, {
            message: "As senhas devem ser iguais",
            path: ["confirmPassword"]
        }))
    })

    const handleSubmit = (data: typeof form.values) => {
        notifications.show({
            id: "register",
            title: "Cadastro",
            message: "Criando conta...",
            color: "cyan",
            autoClose: false,
            withCloseButton: false,
            loading: true
        })
        setLoading(true)
        fire.signUpWithEmailAndPassword(data.email, data.password).then((creds) => {
            // auth.updateCurrentUser(creds.user)
            // updateUser.mutate({
            //     name: data.name
            // })
            updateProfile(creds.user, {
                displayName: data.name
            }).then(() => {
                location.href = "/account"
            })

            notifications.update({
                id: "register",
                title: "Cadastro",
                message: "Conta criada com sucesso!",
                color: "green",
                autoClose: 3000,
                withCloseButton: true,
                loading: false
            })
        }).catch((error) => {
            notifications.update({
                id: "register",
                title: "Cadastro",
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
                id: "register",
                title: "Cadastro",
                message: "Criando conta...",
                color: "cyan",
                autoClose: false,
                withCloseButton: false,
                loading: true
            })
            fire.signInWithProvider(provider).then((creds) => {
                auth.updateCurrentUser(creds.user)
                notifications.update({
                    id: "register",
                    title: "Cadastro",
                    message: "Conta criada com sucesso!",
                    color: "green",
                    autoClose: 5000,
                    withCloseButton: true,
                    loading: false
                })
                location.href = "/account"
            }).catch((error) => {
                notifications.update({
                    id: "register",
                    title: "Cadastro",
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
                        Bem-vindo ao AuroryCrypto! <br />
                        Crie sua conta com
                    </Title>
                    {/* <Code>{JSON.stringify(session)}</Code>
                    <Code>{auth.currentUser?.uid}</Code> */}
                    <div style={{ zIndex: 5, position: "relative" }}>
                        <LoadingOverlay visible={loading} zIndex={10} />
                        <Box p="md">
                            <Group grow mb="md" >
                                <Button onClick={signInProvider("google")} radius={0} variant="light" leftIcon={<FaGoogle />}>Google</Button>
                                <Button onClick={signInProvider("microsoft")} radius={0} variant="light" leftIcon={<FaMicrosoft />}>Microsoft</Button>
                                <Button onClick={signInProvider("apple")} radius={0} variant="light" leftIcon={<FaApple />}>Apple</Button>
                            </Group>

                            <Divider label="Ou criar conta com email" labelPosition="center" my="lg" />
                            <form onSubmit={form.onSubmit(handleSubmit, handleErrors)}>
                                <TextInput {...form.getInputProps('name')} label="Nome" placeholder="Seu nome" size="md" />
                                <TextInput {...form.getInputProps('email')} label="Email" placeholder="hello@gmail.com" mt="md" size="md" />
                                <PasswordInput {...form.getInputProps('password')} label="Senha" placeholder="Sua senha" mt="md" size="md" />
                                <PasswordInput {...form.getInputProps('confirmPassword')} label="Confirmar senha" placeholder="Confime sua senha" mt="md" size="md" />
                                {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
                                <Button fullWidth mt="xl" size="md" type="submit">
                                    Criar conta
                                </Button>
                            </form>
                        </Box>
                    </div>

                    <Text ta="center" mt="md">
                        Já tem uma conta?{' '}
                        <Anchor component={Link} href="/auth/login" weight={700}>
                            Entrar
                        </Anchor>
                    </Text>
                </Paper>
            </div>
        </LandingLayout>
    );
}

export default RegisterPage;
