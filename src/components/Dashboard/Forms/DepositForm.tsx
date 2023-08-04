import { currencyIconMap } from '@/components/Icons';
import { useAssets, useInvalidateBalanceRelatedQueries } from '@/lib/firebase/client';
import { type Asset } from '@/repositories/AssetsRepository';
import { api } from '@/utils/api';
import { moneyFormatter } from '@/utils/formatter';
import { Button, JsonInput, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import React, { useEffect } from 'react'
import { type IconType } from 'react-icons/lib';
import { z } from 'zod';

interface DepositFormProps { }

const DepositForm: React.FC<DepositFormProps> = ({ }) => {
    const { data: assets, loading } = useAssets()
    const [selectedAsset, setSelectedAsset] = React.useState<Asset | undefined>(undefined)
    const form = useForm({
        initialValues: {
            asset: "",
            amount: 0
        },
        validate: zodResolver(z.object({
            asset: z.string().nonempty("Selecione uma moeda"),
            amount: z.number().min(1 / (10 ** (selectedAsset?.precision ?? 2)) , `O valor deve ser maior que ${1 / (10 ** (selectedAsset?.precision ?? 2))}`)
        }))
    })
    useEffect(() => {
        setSelectedAsset(assets?.find(a => a.id == form.values.asset))
    }, [form.values.asset])
    const currencySymbol = selectedAsset?.symbol ?? 'USD'
    const CurrencyIcon = currencyIconMap[currencySymbol] ?? currencyIconMap.USD!
    const deposit = api.transactions.deposit.useMutation({
        onSuccess: () => {
            notifications.show({
                title: 'Depósito realizado com sucesso',
                message: `Você depositou ${moneyFormatter(form.values.amount, currencySymbol)}`,
                color: 'green',
                icon: <CurrencyIcon />
            })
            form.reset()
        },
        onError: (error) => {
            notifications.show({
                title: 'Erro ao depositar',
                message: error.message,
                color: 'red',
                icon: <CurrencyIcon />
            })
        }
    })

    return <form
        onSubmit={form.onSubmit(values => {
            deposit.mutate({ assetId: values.asset, amount: values.amount })
        })}
    >
        {/* <JsonInput value={JSON.stringify(assets, null, 2)} readOnly minRows={15}></JsonInput> */}
        {loading && <p>Carregando...</p>}
        <Select
            required
            {...form.getInputProps('asset')}
            label="Moeda"
            placeholder="Selecione uma moeda"
            data={assets?.map(asset => ({ value: asset.id!, label: asset.name })) ?? []}
            dropdownPosition='bottom'
        />
        <NumberInput
            required
            mt={'md'}
            label={"Valor "}
            placeholder="Valor"
            min={0.0000000001} // 0.00000008
            step={1 / (10 ** (selectedAsset?.precision ?? 2))}
            precision={selectedAsset?.precision ?? 2}
            icon={<CurrencyIcon />}
            {...form.getInputProps('amount')}
        />
        <Button
            mt={'md'}
            type="submit"
            variant="gradient"
            fullWidth
            loading={deposit.isLoading}
        >
            Depositar
        </Button>
    </form>
}

export default DepositForm;
