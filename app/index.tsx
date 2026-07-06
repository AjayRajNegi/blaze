import { Text, View } from "react-native";

export default function Index() {
  // const { loadUser } = useAuthStore();

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   const token = await SecureStore.getItemAsync("accessToken");
  //   // if (token) {
  //   //   await loadUser();

  //   //   router.replace("/(main)/home" as any);
  //   // } else {
  //   //   router.replace("/(auth)/onboarding" as any);
  //   // }

  //   if (token) {
  //     await loadUser();
  //     console.log("User");
  //   } else {
  //     console.log("no user");
  //   }
  // };

  return (
    <View className="flex-1 bg-[#0A0A00F] items-center justify-center">
      {/* <ActivityIndicator color={"#E8500A"} size={"large"} /> */}
      <Text className="text-black">Hello</Text>
    </View>
  );
}
