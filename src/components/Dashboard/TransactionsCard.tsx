'use client'

import { useTransactions } from "@/lib/firebase/client";
import { UserTransaction } from "@/repositories/UserTransactionsRepository";
import { moneyFormatter, transactionOperationFormatter } from "@/utils/formatter";
import { Box, Card, Group, Stack, Text, Title, createStyles, useMantineTheme } from "@mantine/core";
import { FaMoneyBillWave, FaTrain } from "react-icons/fa6";
import PageCard from "./PageCard";
import { useMediaQuery } from "@mantine/hooks";
import ListCard from "./ListCard";

const useStyles = createStyles((theme) => ({
    card: {
        borderRadius: theme.radius.xl,
        padding: theme.spacing.md,

        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]}`,
    },
    iconBox: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[8],
        padding: 8,
        borderRadius: theme.radius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
    },
    description: {
        fontSize: theme.fontSizes.md,
        fontWeight: 500,
    },
    time: {
        marginTop: -6,
        fontSize: theme.fontSizes.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5],
        fontWeight: 500,
    },
    message: {
        textAlign: 'center',
        marginTop: theme.spacing.xl,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    }
}))

export const TransactionCard: React.FC<{
    transaction: UserTransaction
}> = ({ transaction }) => {
    const { classes } = useStyles()

    return <Card className={classes.card}>
        <Group position="apart">
            <Group noWrap>
                <Box className={classes.iconBox}>
                    <FaMoneyBillWave size={30} />
                </Box>
                <Stack spacing={'xs'} justify="center">
                    <Text className={classes.description}>{transactionOperationFormatter(transaction.operation)}</Text>
                    <Text className={classes.time}>{transaction.createdAt.toDate?.().toLocaleString()}</Text>
                </Stack>
            </Group>
            <Text align="right" size={'lg'} weight={500}>{transaction.type == "income" ? '+' : '-'} {moneyFormatter(transaction.amount, transaction.asset.symbol, transaction.asset.precision)}</Text>
        </Group>
    </Card>
}

const TransactionsCard: React.FC<{}> & { Transaction: typeof TransactionCard } = ({ }) => {
    const { classes } = useStyles()
    const { data: transactions, loading, error } = useTransactions()

    return <PageCard title="Transações">
        <ListCard>
            {transactions?.map((transaction) => <TransactionCard key={transaction.id}
                transaction={transaction}
            />)}
            {loading && <Text>Carregando...</Text>}
            {transactions?.length == 0 && <Text classNames={classes.message}>Faça uma Trasação para aparecer aqui {':)'}</Text>}
            {error && <Text classNames={classes.message}>Erro ao carregar as transações</Text>}

        </ListCard>
    </PageCard>
}
TransactionsCard.Transaction = TransactionCard;

export default TransactionsCard;
