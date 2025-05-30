
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface TransactionCategory {
  id: string;
  transaction_id: number;
  category_id: string;
  created_at: string;
}

export function useTransactionCategories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getTransactionCategories = async (transactionId: number) => {
    if (!user?.id) return [];
    
    const { data, error } = await supabase
      .from('transaction_categories')
      .select(`
        *,
        categorias(id, nome, tags)
      `)
      .eq('transaction_id', transactionId);

    if (error) {
      console.error('Erro ao buscar categorias da transação:', error);
      throw error;
    }

    return data || [];
  };

  const addTransactionCategories = useMutation({
    mutationFn: async ({ transactionId, categoryIds }: { transactionId: number; categoryIds: string[] }) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      // Primeiro, remover todas as categorias existentes da transação
      await supabase
        .from('transaction_categories')
        .delete()
        .eq('transaction_id', transactionId);

      // Então, adicionar as novas categorias
      if (categoryIds.length > 0) {
        const { data, error } = await supabase
          .from('transaction_categories')
          .insert(
            categoryIds.map(categoryId => ({
              transaction_id: transactionId,
              category_id: categoryId,
            }))
          );

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-categories'] });
    },
    onError: (error) => {
      console.error('Erro ao salvar categorias:', error);
      toast({
        title: "Erro ao salvar categorias",
        description: "Não foi possível salvar as categorias da transação",
        variant: "destructive",
      });
    },
  });

  return {
    getTransactionCategories,
    addTransactionCategories: addTransactionCategories.mutate,
    isUpdating: addTransactionCategories.isPending,
  };
}
