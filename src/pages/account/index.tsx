import Layout from "@/components/Dashboard/Layout";
import TransactionsCard from "@/components/Dashboard/TransactionsCard";
import { type NextPage } from "next";

const AccountIndex: NextPage = () => {
    // const { auth } = useAuth()
    // const { user } = useFirebaseContext()

    return <Layout>
        <TransactionsCard />
    </Layout>
}

export default AccountIndex;

