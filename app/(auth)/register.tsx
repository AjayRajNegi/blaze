import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { useCallback, useState } from "react";
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

export default function register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isLoading, error, clearError } = useAuthStore();

  const clearFieldError = useCallback((field: string) => {
    setErrors((e) => ({ ...e, [field]: "" }));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim()) e.lastName = "Required";
    if (!email.trim()) e.email = "Email is Required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Phone is Required";
    else if (!/^[6-9]\d{9}$/.test(phone))
      e.phone = "Enter valid 10-digit Indian mobile";
    if (!password.trim()) e.password = "Password is Required";
    else if (password.length < 8) e.password = "Minimum 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;

    try {
      await register({
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        phone,
        password,
      });
      router.replace("/(main)/home");
    } catch (error) {}
  };
  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-8">
            {/* Back Button */}
            <TouchableOpacity onPress={() => router.back()} className="mb-10">
              <View className="w-10 h-10 rounded-xl bg-[#13131A] border border-[#22222E] items-center justify-center ">
                <Text className="text-white text-xl font-extrabold -mt-2.5">
                  ←
                </Text>
              </View>
            </TouchableOpacity>

            {/* Heading */}
            <View className="mb-10">
              <Text className="text-[#9494AB] text-sm font-medium tracking-wider uppercase mb-3">
                Get Started
              </Text>
              <Text className="text-white font-bold text-5xl leading-tight">
                Create your {"\n"} Account
              </Text>
            </View>

            {/* Error */}
            {error && (
              <View className="bg-[#FF4D4D15] border border-[#FF4D4D40] rounded-2xl px-4 py-3 mb-6">
                <Text className="text-[#FF4D4D] text-sm font-medium">
                  {error}
                </Text>
              </View>
            )}

            {/* Form */}
            <View className="mb-8" style={{ gap: 16 }}>
              <View className="flex flex-row" style={{ gap: 12 }}>
                {/* FirstName */}
                <View className="flex-1">
                  <Text className="text-[#9494A8] text-xs font-semibold uppercase mb-2 ml-1">
                    First Name
                  </Text>
                  <View
                    className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.firstName ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                  >
                    <TextInput
                      value={firstName}
                      onChangeText={(t) => {
                        setFirstName(t);
                        clearFieldError("firstName");
                      }}
                      placeholder="Ajay"
                      placeholderTextColor={"#5A5A72"}
                      autoCorrect={false}
                      className="text-white text-base"
                    />
                    {errors?.firstName && (
                      <Text className="text-red-500 text-xs mt-1.5 ml-1">
                        {errors.firstName}
                      </Text>
                    )}
                  </View>
                </View>

                {/* LastName */}
                <View className="flex-1">
                  <Text className="text-[#9494A8] text-xs font-semibold uppercase mb-2 ml-1">
                    Last Name
                  </Text>
                  <View
                    className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.lastName ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                  >
                    <TextInput
                      value={lastName}
                      onChangeText={(t) => {
                        setLastName(t);
                        clearFieldError("lastName");
                      }}
                      placeholder="Raj Negi"
                      placeholderTextColor={"#5A5A72"}
                      autoCorrect={false}
                      className="text-white text-base"
                    />
                    {errors?.lastName && (
                      <Text className="text-red-500 text-xs mt-1.5 ml-1">
                        {errors.lastName}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Email */}
              <View>
                <Text className="text-[#9494A8] text-xs font-semibold uppercase mb-2 ml-1">
                  Email Address
                </Text>
                <View
                  className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.email ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      clearFieldError("email");
                    }}
                    placeholder="you@example.com"
                    placeholderTextColor={"#5A5A72"}
                    autoCorrect={false}
                    autoCapitalize="none"
                    autoComplete="email"
                    className="text-white text-base"
                  />
                  {errors?.email && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.email}
                    </Text>
                  )}
                </View>
              </View>

              {/* Phone */}
              <View>
                <Text className="text-[#9494A8] text-xs font-semibold uppercase mb-2 ml-1">
                  Mobile Number
                </Text>
                <View
                  className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.phone ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={phone}
                    onChangeText={(t) => {
                      setPhone(t);
                      clearFieldError("phone");
                    }}
                    placeholder="9876543210"
                    placeholderTextColor={"#5A5A72"}
                    autoCorrect={false}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoComplete="tel"
                    className="text-white text-base"
                  />
                  {errors?.phone && (
                    <Text className="text-red-500 text-xs mt-1.5 ml-1">
                      {errors.phone}
                    </Text>
                  )}
                </View>
              </View>

              {/* Password */}
              <View>
                <Text className="text-[#9494A8] text-xs font-semibold uppercase mb-2 ml-1">
                  Password
                </Text>
                <View
                  className={`bg-[#13131A] border rounded-2xl px-5 py-4 flex-row items-center ${errors.password ? "border-[#FF4D4D]" : "border-[#22222E]"}`}
                >
                  <TextInput
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      clearFieldError("password");
                    }}
                    placeholder="Min. 8 Characters"
                    placeholderTextColor={"#5A5A72"}
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    className="text-white flex-1 text-base"
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
              onPress={handleRegister}
              className="bg-[#E8500A] rounded-2xl py-5 items-center"
            >
              {isLoading ? (
                <ActivityIndicator color={"#fff"} />
              ) : (
                <Text className="text-white font-bold text-sm tracking-widest uppercase">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center mt-2"
            >
              <Text className="text-white text-center text-sm ">
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
