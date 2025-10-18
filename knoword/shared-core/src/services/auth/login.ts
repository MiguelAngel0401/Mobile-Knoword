import { LoginFormData } from "../../types/auth";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const login = async (credentials: LoginFormData): Promise<Tokens> => {
  try {
    const url = "https://unpleading-lawfully-coy.ngrok-free.dev/auth/login";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        "User-Agent": "CustomClient",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error del servidor");
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error: any) {
    throw new Error(error.message || "Error al iniciar sesión");
  }
};