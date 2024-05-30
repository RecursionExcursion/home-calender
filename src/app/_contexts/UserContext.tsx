"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../_types/models/user";
import { getUserCookie } from "../_lib/cookieManager";
import { useRouter } from "next/navigation";
import { validateUserCookie } from "../_service/sessionService";

type UserContextState = {
  user: User;
};

export const UserContext = createContext<UserContextState>({
  user: {} as User,
});

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = (props: UserProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState({} as User);

  const [initalized, setInitialized] = useState(false);

  useEffect(() => {
    getUserCookie().then((cookie) => {
      if (!cookie) {
        router.push("/login");
        return;
      }
      validateUserCookie(cookie.value).then((user) => {
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);
        setInitialized(true);
      });
    });
  }, []);

  const state: UserContextState = {
    user,
  };

  return !initalized ? null : (
    <UserContext.Provider value={state}>{props.children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);