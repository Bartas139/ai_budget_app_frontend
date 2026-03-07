export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;

  const getTransactions = async (userId) => {
    return await $fetch(`${base}/transactions?userId=${userId}`);
  };

  const getCategories = async () => {
    return await $fetch(`${base}/categories`);
  };

  const createTransaction = async (data) => {
    return await $fetch(`${base}/transactions`, {
      method: "POST",
      body: data,
    });
  };

  const confirmTransaction = async (data) => {
    return await $fetch(`${base}/transactions/confirm`, {
      method: "POST",
      body: data,
    });
  };

  const deleteTransaction = async (id) => {
    return await $fetch(`${base}/transactions/${id}`, {
      method: "DELETE",
    });
  };

  return { getTransactions, getCategories, createTransaction, confirmTransaction, deleteTransaction };
};
