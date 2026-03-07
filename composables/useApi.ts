export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  const getTransactions = async (userId: string) => {
    return await $fetch(`${base}/transactions?userId=${userId}`);
  };

  const getCategories = async () => {
    return await $fetch(`${base}/categories`);
  };

  const createTransaction = async (data: any) => {
    return await $fetch(`${base}/transactions`, {
      method: "POST",
      body: data,
    });
  };

  const confirmTransaction = async (data: any) => {
    return await $fetch(`${base}/transactions/confirm`, {
      method: "POST",
      body: data,
    });
  };

  const deleteTransaction = async (id: string) => {
    return await $fetch(`${base}/transactions/${id}`, {
      method: "DELETE",
    });
  };

  return { getTransactions, getCategories, createTransaction, confirmTransaction, deleteTransaction };
};
