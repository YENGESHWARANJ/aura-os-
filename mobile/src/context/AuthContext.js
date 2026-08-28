import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authApi from "../api/services/authApi";

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  demoLogin: () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from AsyncStorage on app launch
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken =
          (await AsyncStorage.getItem("aura_token")) ||
          (await AsyncStorage.getItem("accessToken"));
        const storedUserJson = await AsyncStorage.getItem("user");

        if (storedToken && storedUserJson) {
          const parsedUser = JSON.parse(storedUserJson);
          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (err) {
        console.warn("Error restoring auth from storage", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login(email, password);
      if (data?.success) {
        const accessToken = data.token;
        const loggedUser = data.user;

        await AsyncStorage.setItem("aura_token", accessToken);
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("user", JSON.stringify(loggedUser));

        setToken(accessToken);
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      } else {
        throw new Error(data?.message || "Login failed");
      }
    } catch (err) {
      throw err;
    }
  };

  const demoLogin = async (role, name, email) => {
    const demoUser = {
      _id: `demo-${role}-id`,
      name: name || `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      email: email || `${role}@aura.edu`,
      role: role.toLowerCase(),
    };
    const demoToken = `demo-token-${role}-${Date.now()}`;

    await AsyncStorage.setItem("aura_token", demoToken);
    await AsyncStorage.setItem("accessToken", demoToken);
    await AsyncStorage.setItem("user", JSON.stringify(demoUser));

    setToken(demoToken);
    setUser(demoUser);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore backend logout error
    } finally {
      await AsyncStorage.removeItem("aura_token");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = async (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        demoLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
