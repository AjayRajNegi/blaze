import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { login, isLoading, error, clearError } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 Px-6 pt-8 pb-10">
            <View>
              <View className="flex-row items-center mb-10">
                <View className="w-8 h-8 rounded-lg bg-[#E8500A] items-center justify-center mr-2">
                  <Text className="text-white font-bold text-sm">D</Text>
                </View>

                <Text className="text-white font-bold tracking-wider text-lg">
                  Drive India
                </Text>
              </View>
              <Text className="text-[#9494A8] text-sm font-medium tracking-[3px] uppercase mb-3">
                Welcome back
              </Text>
              <Text className=" text-white font-bold text-5xl leading-tight">
                Sign in to{"\n"}your account.
              </Text>
            </View>
            {error && (
              <View className="bg-[#FF4D4D15] border border-[#FF4D4D40] rounded-2xl px-4 py-3 mb-6">
                <Text className="text-[#FF4D4D] text-sm font-medium">
                  {error}
                </Text>
              </View>
            )}

            <View className="mb-8" style={{ gap: 16 }}>
              <View>
                <Text className="text-[#9494A8] text-xs font-semibold tracking-widest uppercase mb-2">
                  Email Address
                </Text>
                <View
                  className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.email ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    placeholderTextColor={"#5A5A72"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    className="flex-1 text-white text-base"
                  />
                </View>
                {errors?.email && (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-[#9494A8] text-xs font-semibold tracking-widest uppercase mb-2">
                  Password
                </Text>
                <View
                  className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.password ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Min. 8 Characters"
                    keyboardType="email-address"
                    placeholderTextColor={"#5A5A72"}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    className="flex-1 text-white text-base"
                  />
                  <TouchableOpacity
                    className="ml-3 py-1 px-2"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text className="text-[#5A5A72] text-xs font-semibold tracking-wider uppercase">
                      {showPassword ? "hide" : "show"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors?.password && (
                  <Text className="text-red-500 text-xs mt-1.5 ml-1">
                    {errors.password}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              disabled={isLoading}
              activeOpacity={0.85}
              className="bg-[#E8500A]
rounded-2xl py-5 items-center mb-5"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-sm tracking-widest uppercase">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
            <View className="flex-row items-center mb-5">
              <View className="flex-1 h-px bg-[#22222E]" />
              <Text className="text-[#5A5A72] text-xs mx-4 tracking-widest uppercase">
                or
              </Text>
              <View className="flex-1 h-px bg-[#22222E]" />
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              className="border border-[#22222E] rounded-2xl py-5 items-center"
              onPress={() => router.push("/(auth)/register")}
            >
              <Text className="text-white font-semibold text-sm uppercase">
                Create Account
              </Text>
            </TouchableOpacity>

            <Text className="text-[#5A5A72] text-xs text-center mt-8 leading-5">
              By continuing, you agree to our and{" "}
              <Text className="text-[#9494A8]">Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
