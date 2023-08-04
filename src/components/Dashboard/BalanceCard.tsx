"use client"

import { useAuth, useBalance, useFirebaseContext } from "@/lib/firebase/client";
import { moneyFormatter } from "@/utils/formatter";
import { Avatar, Group, createStyles, Text, ActionIcon, Card, HoverCard } from "@mantine/core";
import { FaSignOutAlt } from "react-icons/fa";
import { FaGear } from 'react-icons/fa6';

const useStyles = createStyles((theme) => ({
    wrapper: {
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2]}`,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
    },
    title: {
        fontSize: theme.fontSizes.sm,
        fontWeight: 400,
        textTransform: 'uppercase',
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
    balance: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        // make text bigger
        fontSize: theme.fontSizes.xl,
        fontWeight: 500,
    },
}));


const BalanceCard: React.FC = ({ }) => {
    const { classes } = useStyles();
    const { logout } = useAuth()
    const { user } = useFirebaseContext()
    const { data: balances, loading } = useBalance()

    return (
        <Card withBorder radius={'xl'} p={'md'}>
            {/* <JsonInput value={JSON.stringify(balances, null, 2)} minRows={15} /> */}
            <Group noWrap position="apart">
                <Group noWrap>
                    <Avatar src={""} size={100} radius="xl" />
                    <div>
                        {<Text>
                            Olá, {user?.displayName ?? "Usuário"}
                        </Text>}
                        <Text className={classes.title}>
                            Saldo total em
                        </Text>
                        {!loading ? balances && <Text className={classes.balance}>
                            {moneyFormatter(balances.reduce((prev, asset) => prev + (asset.amount * asset.usdPrice), 0), "USD")}
                        </Text>  /* .map((balance, idx) => (
                            
                        )) */ : <Text>Carregando...</Text>}

                        {/* <Group noWrap spacing={10} mt={3}>
                            <TbAt size="1rem" className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                {email}
                            </Text>
                        </Group>

                        <Group noWrap spacing={10} mt={5}>
                            <TbPhoneCall size="1rem" className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                {phone}
                            </Text>
                        </Group> */}
                    </div>
                </Group>

                <Group position="right">
                    <HoverCard shadow="md" position="left" withArrow>
                        <HoverCard.Target>
                            <ActionIcon
                                variant="outline"
                            >
                                <FaGear />
                            </ActionIcon>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            Configurações
                        </HoverCard.Dropdown>
                    </HoverCard>
                    <HoverCard shadow="md" position="left" withArrow>
                        <HoverCard.Target>
                            <ActionIcon
                                variant="outline"
                                color="red"
                                onClick={logout}
                            >
                                <FaSignOutAlt />
                            </ActionIcon>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                            Sair
                        </HoverCard.Dropdown>
                    </HoverCard>
                </Group>
            </Group>
        </Card>
    );
}

export default BalanceCard
