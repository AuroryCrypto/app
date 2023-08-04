import { currencyIconMap } from '@/components/Icons';
import { useBalance, useInvalidateBalanceRelatedQueries } from '@/lib/firebase/client';
import { Asset } from '@/repositories/AssetsRepository';
import { UserAsset } from '@/repositories/UserAssetsRepository';
import { api } from '@/utils/api';
import { moneyFormatter } from '@/utils/formatter';
import { Button, JsonInput, NumberInput, Select } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React, { useEffect } from 'react'
import { IconType } from 'react-icons';
import { z } from 'zod';

interface WithdrawFormProps { }

const WithdrawForm: React.FC<WithdrawFormProps> = ({ }) => {
    const { data: balance, loading } = useBalance()
    let [selectedAsset, setSelectedAsset] = React.useState<UserAsset | undefined>(undefined)
    const form = useForm({
        initialValues: {
            assetId: "",
            amount: 0,
        },
        validate: zodResolver(z.object({
            assetId: z.string().nonempty("Selecione uma moeda"),
            amount: z.number().min(1 / (10 ** (selectedAsset?.precision ?? 2)), `O valor deve ser maior que ${1 / (10 ** (selectedAsset?.precision ?? 2))}`)
        }))
    })
    useEffect(() => {
        setSelectedAsset(balance?.find(a => a.id == form.values.assetId))
    }, [form.values.assetId])
    const currencySymbol = selectedAsset?.symbol ?? 'USD'
    const CurrencyIcon = currencyIconMap[currencySymbol] ?? currencyIconMap['USD'] as IconType
    const withdraw = api.transactions.withdraw.useMutation({
        onSuccess: () => {
            notifications.show({
                title: 'Saque realizado com sucesso',
                message: `Você sacou ${moneyFormatter(form.values.amount, selectedAsset?.symbol ?? 'USD')}`,
                color: 'green',
                icon: <CurrencyIcon />
            })
            // invalidateBalance()
            form.reset()
        },
        onError: (error) => {
            notifications.show({
                title: 'Erro ao sacar',
                message: error.message,
                color: 'red',
                icon: <CurrencyIcon />
            })
        }
    })

    return <form onSubmit={form.onSubmit(values => withdraw.mutate(values))}>
        {/* <JsonInput value={JSON.stringify(balance, null, 2)} readOnly minRows={15}></JsonInput> */}
        {loading && <p>Carregando...</p>}
        <Select
            required
            {...form.getInputProps('assetId')}
            label="Moeda"
            placeholder="Selecione uma moeda"
            data={balance?.map(b => ({ value: b.id!, label: b.name })) ?? []}
        />
        <NumberInput
            required
            mt='md'
            {...form.getInputProps('amount')}
            label="Valor"
            placeholder="0.00"
            max={selectedAsset?.amount ?? 0}
            min={1 / (10 ** (selectedAsset?.precision ?? 2))}
            step={1 / (10 ** (selectedAsset?.precision ?? 2))}
            precision={selectedAsset?.precision ?? 2}
            disabled={loading}
            icon={<CurrencyIcon />}
        />
        <Button
            mt='md'
            type="submit"
            variant='gradient'
            fullWidth
            loading={withdraw.isLoading || loading}
        >
            Sacar
        </Button>
    </form>
}

export default WithdrawForm;