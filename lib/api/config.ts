export function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("Переменная NEXT_PUBLIC_API_URL не задана");
  }

  return apiUrl.replace(/\/$/, "");
}
