import { env } from "process";

export async function APIRequest(
  method: string,
  endpoint: string,
  body?: any,
  isFormData = false
) {
  try {
    const url = `${env.Nocodb_BaseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "xc-token": env.Nocodb_accessToken || "",
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        "APIRequest Error:",
        res.status,
        res.statusText,
        endpoint,
        errorText
      );
      throw new Error(
        `APIRequest Error: ${res.status} ${res.statusText} -> ${errorText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("APIRequest request failed:", error);
    throw error;
  }
}
