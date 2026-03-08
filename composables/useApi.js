export const useApi = () => {
  const config = useRuntimeConfig();
  const base = config.public.apiBase;
  const { session } = useSession();

  const authFetch = async (url, options = {}) => {
    const token = await session.value?.getToken();
    try {
      return await $fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      const message = err?.data?.message || err?.message || "Neočekávaná chyba.";
      throw new Error(message);
    }
  };

  const getTransactions = async () => {
    return await authFetch(`${base}/transactions`);
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

  return {
    getTransactions,
    getCategories,
    createTransaction,
    confirmTransaction,
    deleteTransaction,
  };
};
