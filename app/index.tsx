import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      await loadUser();
      const { user } = useAuthStore.getState();

      if (user) {
        router.replace("/(main)/home");
      } else {
        router.replace("/(auth)/login");
      }
    } else {
      router.replace("/(auth)/onboarding");
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A00F] items-center justify-center">
      <ActivityIndicator color={"#E8500A"} size={"large"} />
    </View>
  );
}
