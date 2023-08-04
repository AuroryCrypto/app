import Layout from "@/components/Dashboard/Layout";
import ListCard, { ListCardItem } from "@/components/Dashboard/ListCard";
import PageCard from "@/components/Dashboard/PageCard";
import { currencyIconMap } from "@/components/Icons";
import { useBalance } from "@/lib/firebase/client";
import { Group, Text, createStyles } from "@mantine/core";
import { type NextPage } from "next";

const useStyles = createStyles((theme) => ({
    message: {
        textAlign: 'center',
        marginTop: theme.spacing.xl,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    }
}))

const AssetsPage: NextPage = () => {
    const { data, error, loading } = useBalance()
    const {classes} = useStyles()

    const items = data?.map((item, idx) => {
        const Icon = currencyIconMap[item.symbol]
        return <ListCardItem leftIcon={Icon} key={idx}>
            <Group
                position="apart"
                noWrap
            >
                <Text size={'lg'} weight={500}>{item.name}</Text>
                <Text align="right" size={'lg'} weight={400}>{item.amount} {item.symbol}</Text>
            </Group>
        </ListCardItem>
    })

    return <Layout>
        <PageCard title="Ativos">
            <ListCard>
                {loading ? <Text className={classes.message}>Carregando...</Text> : items}
                {error && <Text className={classes.message}>Erro ao carregar os ativos</Text>}
                {!loading && !error && items?.length == 0 && <Text className={classes.message}>Deposite crypto ou dinheiro para começar a usar sua conta {':)'}</Text>}
            </ListCard>
        </PageCard>
    </Layout>
}

export default AssetsPage;
