export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;
  const { getToken } = useAuth();

  const authFetch = async (url, options = {}) => {
    const token = await getToken();
    return $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getTransactions = async (userId) => {
    return await authFetch(`${base}/transactions?userId=${userId}`);
  };

  const getCategories = async () => {
    return await authFetch(`${base}/categories`);
  };

  const createTransaction = async (data) => {
    return await authFetch(`${base}/transactions`, {
      method: "POST",
      body: data,
    });
  };

  const confirmTransaction = async (data) => {
    return await authFetch(`${base}/transactions/confirm`, {
      method: "POST",
      body: data,
    });
  };

  const deleteTransaction = async (id) => {
    return await authFetch(`${base}/transactions/${id}`, {
      method: "DELETE",
    });
  };

  return { getTransactions, getCategories, createTransaction, confirmTransaction, deleteTransaction };
};
