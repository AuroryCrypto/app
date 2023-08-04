import LandingLayout from "@/components/Landing/Layout";
import { Grid, Text } from "@mantine/core";
import { type NextPage } from "next";

const FinishingRegisterPage: NextPage = () => {
    return <LandingLayout>
        <h1>Finalizar cadastro</h1>
        <Grid columns={20}>
            <Grid.Col span={20}>
                <Text></Text>
            </Grid.Col>
        </Grid>
    </LandingLayout>
}

export default FinishingRegisterPage;
