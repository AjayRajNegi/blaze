import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await SecureStore.getItemAsync("accessToken");
    // console.log(token);
    if (token) {
      await loadUser();

      router.replace("/(main)/home" as any);
    } else {
      router.replace("/(auth)/onboarding" as any);
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A00F] items-center justify-center">
      {/* <ActivityIndicator color={"#E8500A"} size={"large"} /> */}
      <Text className="text-white">Hello</Text>
    </View>
  );
}
