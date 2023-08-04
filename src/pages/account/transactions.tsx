import Layout from "@/components/Dashboard/Layout";
import TransactionsCard from "@/components/Dashboard/TransactionsCard";
import { NextPage } from "next";

const TransactionsPage: NextPage = () => {
    return <Layout>
        <TransactionsCard />
    </Layout>
}

export default TransactionsPage;
