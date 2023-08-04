import { transactionOperationFormatter, moneyFormatter } from '@/utils/formatter';
import { Box, Card, Group, Stack, Text, createStyles } from '@mantine/core';
import React from 'react'
import { type IconType } from 'react-icons';
import { FaMoneyBillWave } from 'react-icons/fa6';

const useStyles = createStyles((theme) => ({
    card: {
        borderRadius: theme.radius.xl,
        padding: theme.spacing.md,

        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]}`,

        // make contents inline
        // display: 'flex',
        // alignItems: 'center',
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
    }
}))

interface ListProps {
    children: React.ReactNode;
}

interface ListItemProps {
    children: React.ReactNode;
    leftIcon?: IconType;
}

export const ListCardItem: React.FC<ListItemProps> = ({ children, leftIcon }) => {
    const { classes } = useStyles()
    const LeftIcon = leftIcon || FaMoneyBillWave

    return <Card className={classes.card}>
        {/* <Group position="apart"> */}
        <Group noWrap>
            {leftIcon && <Box className={classes.iconBox}>
                <LeftIcon size={30} />
            </Box>}
            <div
                style={{
                    display: 'block',
                    width: '100%',
                }}
            >
                {children}
            </div>
        </Group>
        {/* </Group> */}
    </Card>
}

const ListCard: React.FC<ListProps> = ({ children }) => {
    return <Stack spacing={'xs'} justify="flex-start">
        {children}
    </Stack>
}

// ListCard.Item = ListItem

export default ListCard;
