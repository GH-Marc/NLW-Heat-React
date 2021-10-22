import { createContext, ReactNode, useEffect, useState } from "react"
import { api } from "../services/api"

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  sign_in_url: string;
  sign_out: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export function AuthProvider(props: AuthProvider) {
  const [user, setUser]  = useState<User | null>(null);

  const sign_in_url = `https://github.com/login/oauth/authorize?scope=user&client_id=f419002a7495451ce395`;

  async function sign_in(github_code: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: github_code,
    });

    const { token, user } = response.data;

    localStorage.setItem('@dowhile:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function sign_out() {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const has_github_code = url.includes('?code=');

    if (has_github_code) {
      const [url_without_code, github_code] = url.split('?code=');

      window.history.pushState({}, '', url_without_code);

      sign_in(github_code);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ sign_in_url, user, sign_out }}>
      {props.children}
    </AuthContext.Provider>
  )
}
