import { Box, Group, SimpleGrid, Stack, createStyles, Text, Card, createPolymorphicComponent } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { forwardRef } from "react";
import { FaCcVisa, FaCircle, FaCircleDot, FaCreditCard, FaMoneyBillTransfer, FaMoneyBills, FaPlus } from "react-icons/fa6";
import { type IconType } from "react-icons/lib";
import DepositForm from "./Forms/DepositForm";
import WithdrawForm from "./Forms/WithdrawForm";
import { useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/pages/_app";
import { FaExchangeAlt } from "react-icons/fa";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
    wrapper: {
        // paddingTop: theme.spacing.sm,
        // paddingBottom: theme.spacing.sm,

        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gridGap: theme.spacing.sm,
        gridAutoRows: 'minmax(100px, 1fr)',
    },
    box: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[8],
        borderRadius: theme.radius.xl,
        padding: 16,
        border: 'none',

        // maxHeight: 100,
        textAlign: 'center',
        minWidth: 110,
        minHeight: 110,
        cursor: 'pointer',
    },
    ccText: {
        fontSize: 16,
        fontWeight: 500,
    },
    newShortcut: {
        borderRadius: theme.radius.xl,
        borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.dark[2],
        borderWidth: 2,
        borderStyle: 'dashed',

        color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.dark[2],

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    NewShortcutIcon: {
        color: theme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.dark[2],
        // position: 'absolute',
        top: '50%',
        left: '50%',
    }
}))

interface GenericShortcutProps {
    icon: IconType,
    bottomText: string,
}

const _GenericShortcut = forwardRef<HTMLButtonElement, GenericShortcutProps>(({ icon, bottomText, ...others }, ref) => {
    const { classes } = useStyles()
    const Icon = icon

    return <Box className={classes.box} component="button" ref={ref} {...others}>
        <Stack justify="space-between">
            <Group position="apart" noWrap>
                <Icon size={30} />
                {/* <FaCircleDot size={24} /> */}
            </Group>
            <div>
                <Text className={classes.ccText}>{bottomText}</Text>
            </div>
        </Stack>
    </Box>
})
const GenericShortcut = createPolymorphicComponent<'button', GenericShortcutProps>(_GenericShortcut)

interface CreditCardShortcutProps {
    brand: string,
    last4: string,
}

const _CreditCardShortcut = forwardRef<HTMLButtonElement, CreditCardShortcutProps>(({ brand, last4, ...others }, ref) => {
    const { classes } = useStyles()

    return <Box className={classes.box} component="button" ref={ref} {...others}>
        <Stack justify="space-between">
            <Group position="apart" noWrap>
                <FaCcVisa size={30} />
                <FaCircleDot size={24} />
            </Group>
            <div>
                <Text align="center" className={classes.ccText}>**** {last4}</Text>
            </div>
        </Stack>
    </Box>
})
const CreditCardShortcut = createPolymorphicComponent<'button', CreditCardShortcutProps>(_CreditCardShortcut)

interface NewShortcutProps {
    // children: React.ReactNode;
}

const _NewShortcut = forwardRef<HTMLButtonElement, NewShortcutProps>((others, ref) => {
    const { classes, cx } = useStyles()

    return <Box className={cx(classes.box, classes.newShortcut)} component="button" ref={ref} {...others}>
        <FaPlus size={30} className={classes.NewShortcutIcon} />
    </Box>
})

const NewShortcut = createPolymorphicComponent<'button', NewShortcutProps>(_NewShortcut)

const openDepositModal = () => modals.open({
    title: 'Depositar',
    children: <DepositForm />,

})

const openWithdrawModal = () => modals.open({
    title: 'Sacar',
    children: <WithdrawForm />,
    onClose() {
        queryClient.invalidateQueries()
    },
})

const onCreditCardClick = () => notifications.show({
    title: 'Cartões',
    message: 'Em breve você poderá adicionar novos cartões de crédito e débito!',
    color: 'cyan',
    icon: <FaCircle size={24} />,
    loading: true,
})

const onNewShortcutClick = () => notifications.show({
    title: 'Novo atalho',
    message: 'Em breve você poderá adicionar novos atalhos!',
    color: 'cyan',
    icon: <FaCircle size={24} />,
    loading: true,
})

const Shortcuts = () => {
    const { classes } = useStyles()

    return <Box className={classes.wrapper}>
        <GenericShortcut icon={FaMoneyBillTransfer} bottomText="Depositar" onClick={openDepositModal} />
        <GenericShortcut icon={FaMoneyBillTransfer} bottomText="Sacar" onClick={openWithdrawModal} />
        <GenericShortcut icon={FaCreditCard} bottomText="Cartões" onClick={onCreditCardClick} />
        <GenericShortcut icon={FaExchangeAlt} bottomText="Transações" component={Link} href={'/account'} />
        <GenericShortcut icon={FaMoneyBills} bottomText="Ativos" component={Link} href={'/account/assets'} />
        <NewShortcut onClick={onNewShortcutClick}
        />
    </Box>
}

    export default Shortcuts;

    Shortcuts.CreditCardShortcut = CreditCardShortcut
