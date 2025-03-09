import api from "../api";

const url = process.env.EXPO_PUBLIC_CURRENCY_API_URL;

export async function APIgetCurrencies(
  originCurrency: string,
  convertedCurrency: string,
): Promise<number> {
  try {
    const response = await api.get(`${url}/${originCurrency}.json`);
    return response.data[originCurrency][convertedCurrency] || 0;
  } catch (error) {
    console.error("Error fetching currency data:", error);
    throw error;
  }
}
