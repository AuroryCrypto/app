import { Box, Grid, Stack, createStyles } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { HeaderMenu } from "./HeaderMenu"
import BalanceCard from "./BalanceCard"
import Shortcuts from "./Shortcuts"
import MoneyExchangeCard from "./MoneyExchangeCard"

const useStyles = createStyles((theme) => ({
    wrapper: {
        paddingTop: 20,
        paddingLeft: 400,
        paddingRight: 400,
        // [theme.fn.largerThan('xl')]: {

        // },
        [theme.fn.smallerThan('xl')]: {
            paddingLeft: 150,
            paddingRight: 150,
        },
        [theme.fn.smallerThan('lg')]: {
            paddingLeft: 90,
            paddingRight: 90,
        },
        [theme.fn.smallerThan('md')]: {
            paddingLeft: 50,
            paddingRight: 50,
        },
        [theme.fn.smallerThan('sm')]: {
            paddingLeft: 25,
            paddingRight: 25,
        },
    }
}))

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { classes } = useStyles()

    return <>
        <Box className={classes.wrapper}>
            <Grid columns={12}>
                <Grid.Col xs={12} sm={12} md={12} lg={4}>
                    <Stack spacing={'md'}>
                        <BalanceCard />
                        <Shortcuts />
                        <MoneyExchangeCard />
                    </Stack>
                </Grid.Col>
                <Grid.Col xs={12} sm={12} md={12} lg={8}>
                    {children}
                </Grid.Col>
            </Grid>

        </Box>
    </>
}

export default Layout
