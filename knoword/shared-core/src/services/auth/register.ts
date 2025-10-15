import publicApiClient from "../client/publicApiClient";

export interface CheckAvailabilityResponse {
  available: boolean;
  message: string;
}

// ✅ Función auxiliar para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const checkEmail = async (email: string): Promise<CheckAvailabilityResponse> => {
  // ✅ No hacer petición si el email no es válido
  if (!isValidEmail(email)) {
    return { 
      available: false, 
      message: "El correo no es válido" 
    };
  }

  try {
    const response = await publicApiClient.get("/auth/check-email", {
      params: { email },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409 || error.response?.status === 400) {
      return { 
        available: false, 
        message: error.response?.data?.message || "Este correo ya está registrado" 
      };
    }
    throw error;
  }
};

export const checkUsername = async (username: string): Promise<CheckAvailabilityResponse> => {
  // ✅ No hacer petición si el username es muy corto
  if (username.length < 3) {
    return { 
      available: false, 
      message: "El nombre de usuario debe tener al menos 3 caracteres" 
    };
  }

  try {
    const response = await publicApiClient.get("/auth/check-username", {
      params: { username },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409 || error.response?.status === 400) {
      return { 
        available: false, 
        message: error.response?.data?.message || "Este nombre de usuario ya está en uso" 
      };
    }
    throw error;
  }
};

export interface RegisterUserData {
  email: string;
  password: string;
  username: string;
  realName: string;
  bio?: string;
  avatar?: string;
}

export const registerUser = async (data: RegisterUserData) => {
  const response = await publicApiClient.post("/auth/register", data);
  return response.data;
};