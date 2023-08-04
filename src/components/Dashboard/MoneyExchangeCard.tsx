import { ActionIcon, Box, Button, Card, Divider, Group, NumberInput, Overlay, Stack, Text, TextInput, ThemeIcon, createStyles } from "@mantine/core";
import { FaBitcoin, FaDollarSign } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { TbArrowsExchange } from "react-icons/tb";
import { useReducer } from "react";
import { useSetState } from "@mantine/hooks";
import { currencyIconMap } from "../Icons";
import { useBalance } from "@/lib/firebase/client";
import { type UserAsset } from "@/repositories/UserAssetsRepository";


const useMoneyExchangeCardStyles = createStyles((theme) => ({
}))

const MoneyExchangeValueCard: React.FC<{
    currencyName: string,
    currencyType: string,
    amount: number,
    precision?: number,
    setAmount?: (amount: number) => void,
    setCurrencyId: (currencyId: string) => void
    userAssets: UserAsset[]
}> = ({ amount, currencyName, currencyType, setAmount, setCurrencyId, userAssets, precision }) => {
    const CoinIcon = currencyIconMap[currencyType] ?? FaBitcoin

    return <Card withBorder radius={'xl'} p={'md'}>
        <Box p='md'>
            <Group position="apart" noWrap align="flex-end">
                <Stack justify="space-around">
                    <CoinIcon size={30} />
                    <div>
                        <Text c="dimmed">{currencyType}</Text>
                        <Text size={'lg'} weight={500}>{currencyName}</Text>
                    </div>
                </Stack>
                {setAmount
                    ? <NumberInput
                        defaultValue={amount}
                        precision={8}
                        step={0.01}
                    />
                    : <Text
                        size={'lg'}
                        weight={500}
                    >
                        {amount}
                    </Text>}
            </Group>
        </Box>
    </Card>
}

const MoneyExchangeCard: React.FC = ({ }) => {
    const { data: balance, error, loading } = useBalance()

    const [state, setState] = useSetState({
        currency1: {
            name: "Bitcoin",
            type: "BTC",
            amount: 0.00000000,
            precision: 8,
        },
        currency2: {
            name: "Dólar",
            type: "USD",
            amount: 0.00,
            precision: 2,
        },
    })
    const reverseCurrencies = () => {
        setState({
            currency1: state.currency2,
            currency2: state.currency1,
        })
    }
    const currencyById = (id: string) => {
        return balance?.find((asset) => asset.id === id)
    }

    return <Card withBorder radius={'xl'} p={'md'}>
        
        <MoneyExchangeValueCard
            currencyName={state.currency1.name}
            currencyType={state.currency1.type}
            amount={state.currency1.amount}
            userAssets={balance ?? []}
            setCurrencyId={(currencyId => {

            })}
        />
        <Divider
            labelPosition="center"
            // label={<div style={{ background: "linear-gradient(151deg, #F83D6A 0%, #937DEF 100%)", borderRadius: 16, color:'white', padding: 16 }}>
            //     <FaExchangeAlt size={20} />
            // </div>}
            label={<ActionIcon variant="gradient" size="xl" radius={'lg'} onClick={reverseCurrencies}>
                <TbArrowsExchange size={20} />
            </ActionIcon>}
        />
        <Overlay blur={2}>
            <Text size={'lg'} sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>Em breve...</Text>
        </Overlay>
        <MoneyExchangeValueCard
            currencyName={state.currency2.name}
            currencyType={state.currency2.type}
            amount={state.currency2.amount}
            userAssets={balance ?? []}
            setCurrencyId={(currencyId) => {
                const c = currencyById(currencyId)
                setState({
                    currency2: {
                        amount: c?.amount ?? 0,
                        name: c?.name ?? '',
                        type: c?.type ?? '',
                        precision: c?.precision ?? 2,
                    }
                })
            }}
        />
        <Button variant="gradient" fullWidth radius={'xl'} mt='md' c="white">Converter</Button>
    </Card>
}

export default MoneyExchangeCard;