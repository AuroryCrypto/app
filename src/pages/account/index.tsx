import BalanceCard from "@/components/Dashboard/BalanceCard";
import Layout from "@/components/Dashboard/Layout";
import MoneyExchangeCard from "@/components/Dashboard/MoneyExchangeCard";
import Shortcuts from "@/components/Dashboard/Shortcuts";
import TransactionsCard from "@/components/Dashboard/TransactionsCard";
import { useAuth } from "@/lib/firebase/client";
import { Box, Container, Grid, Group, SimpleGrid, Stack, Table } from "@mantine/core";
import { NextPage } from "next";
import { FaCcVisa } from "react-icons/fa6";

const AccountIndex: NextPage = () => {
    const { auth, user } = useAuth()

    return <Layout>
        <TransactionsCard />
    </Layout>
}

export default AccountIndex;

