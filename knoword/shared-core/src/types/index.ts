// Exportar todos los tipos
export * from "./users";
export * from "./community";

// Tipos adicionales que pueden ser útiles
export interface ApiResponse<T = any> {
  data?: T;
  message: string;
  success: boolean;
  statusCode?: number;
}