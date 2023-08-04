import transactions from '@/pages/account/transactions';
import { Card, Stack, Title } from '@mantine/core';
import React from 'react'
import { TransactionCard } from './TransactionsCard';

interface PageCardProps {
    children: React.ReactNode;
    title?: string;
}

const PageCard: React.FC<PageCardProps> = ({ children, title }) => {
    return <Card withBorder radius={'xl'} padding={'md'}>
        {title && <Title order={2} weight={500} m={'sm'}>{title}</Title>}
        {children}
    </Card>
}

export default PageCard;
