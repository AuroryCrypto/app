// export const moneyFormatter = (value: any, currency: null | string = 'BRL') => Intl.NumberFormat('pt-BR', {
//     currency: currency ?? 'BRL',
//     style: 'currency',
//     notation: 'compact',
// }).format(Number(value))
export const moneyFormatter = (value: any, currency: null | string = 'BRL', precision = 2) => `${Number(value).toFixed(precision)} ${currency}`
export const dateFormatter = (value: any) => new Date(value).toLocaleDateString('pt-BR')

export const transactionOperationFormatter = (value: any) => {
    switch (value) {
        case 'deposit':
            return 'Depósito'
        case 'withdraw':
            return 'Saque'
        case 'transfer':
            return 'Transferência'
    }
}
