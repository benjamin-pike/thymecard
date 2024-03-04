import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendRequest } from '@/lib/api/sendRequest';
import { ROUTES } from './routes';
import { IStock, IStockCategory, EStockSection } from '@thymecard/types';

export const useStockAPI = () => {
    const { mutateAsync: callGetStock } = useMutation(async () => {
        const { status, data } = await sendRequest<{ stock: IStock }>(ROUTES.STOCK.GET_STOCK, 'GET');
        if (status !== 200) {
            throw new Error('Failed to fetch the recipe');
        }
        return data;
    });

    const getStock = useCallback(async () => {
        const { stock } = await callGetStock();

        return stock;
    }, [callGetStock]);

    const { mutateAsync: callUpsertStock } = useMutation(
        async ({ section, categories }: { section: EStockSection; categories: IStockCategory[] }) => {
            const { status, data } = await sendRequest('/stock', 'PUT', {
                body: {
                    section,
                    categories
                }
            });

            if (status !== 200 && status !== 201) {
                throw new Error('Failed to upsert recipe');
            }

            return data;
        }
    );

    const upsertStock = useCallback(
        async (section: EStockSection, categories: IStockCategory[]) => {
            const { stock } = await callUpsertStock({ section, categories });

            return stock;
        },
        [callUpsertStock]
    );

    return {
        getStock,
        upsertStock
    };
};
