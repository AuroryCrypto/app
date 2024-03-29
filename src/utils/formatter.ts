// export const moneyFormatter = (value: any, currency: null | string = 'BRL') => Intl.NumberFormat('pt-BR', {
//     currency: currency ?? 'BRL',
//     style: 'currency',
//     notation: 'compact',
// }).format(Number(value))
export const moneyFormatter = (value: string | number, currency: null | string = 'BRL', precision = 2) => `${Number(value).toFixed(precision)} ${currency}`
export const dateFormatter = (value: string | number | Date) => new Date(value).toLocaleDateString('pt-BR')

export const transactionOperationFormatter = (value: string | null) => {
    switch (value) {
        case 'deposit':
            return 'Depósito'
        case 'withdraw':
            return 'Saque'
        case 'transfer':
            return 'Transferência'
    }
}
