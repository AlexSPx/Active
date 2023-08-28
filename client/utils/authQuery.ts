import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";
import { getToken } from "./userTokens";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { API_ADDRESS } from "./configs";
import { useNavigation } from "@react-navigation/native";

export async function authHeaders(
  config?: AxiosRequestConfig<any>
): Promise<AxiosRequestConfig<any>> {
  const token = await getToken();
  return {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${token.value}`,
    },
  };
}

type RequestType = "GET" | "POST" | "PUT" | "DELETE";

export const useAuthQuery = (auth: boolean = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const { signOut } = useAuth();

  async function makeRequest<T>(
    url: string,
    method: RequestType = "GET",
    body?: any,
    headers?: Record<string, string>
  ): Promise<T | null> {
    try {
      setIsLoading(true);

      let requestOptions: RequestInit = {
        method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      };

      if (auth) {
        const token = await getToken();
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }

      const response = await fetch(`${API_ADDRESS}${url}`, requestOptions);

      if (auth && response.status === 401) {
        signOut();
      }

      if (response.status === 401) {
        setError(response.body);
      }

      console.log(error);

      const data: T = await response.json();
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    makeRequest,
    isLoading,
    error,
  };
};

export function useAuthFetch<T>(url: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<any>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const token = await getToken();

        const response = await fetch(`${API_ADDRESS}${url}`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => fetchData());

    return unsubscribe;
  }, [url]);

  return { isLoading, data, error };
}
