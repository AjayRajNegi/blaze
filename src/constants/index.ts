import Constants from "expo-constants";

const debuggerHost = Constants.expoConfig?.hostUri;
const localIp = debuggerHost?.split(":")[0];

export const API_BASE_URL = __DEV__
  ? `http://${localIp}:3000/api/v1`
  : "https://domain.com/api/v1";

export const FUEL_TYPE_LABELS: Record<string, string> = {
  PETROL: "Petrol",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  CNG: "CNG",
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  AUTOMATIC: "Automatic",
};
