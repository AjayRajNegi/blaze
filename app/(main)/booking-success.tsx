import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingSuccess() {
  const { bookingId } = useLocalSearchParams();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      <Animated.View
        className="flex-1 items-center justify-center px-6"
        style={{ opacity: fadeAnim }}
      >
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="w-32 h-32 rounded-full bg-[#00d4aa] items-center justify-center mb-8"
        >
          <Text className="text-white font-bold text-5xl">✔︎</Text>
        </Animated.View>

        <Text className="text-[#00d4aa] text-xs font-bold tracking-[4px] uppercase mb-4">
          Booking Confirmed
        </Text>
        <Text className="text-white font-bold text-4xl text-center leading-tight mb-4">
          You're all{"\n"}set to drive!
        </Text>
        <Text className="text-[#9494a8] text-base text-center leading-7 mb-8">
          Your booking has been confirmed.{"\n"}Have a great ride!
        </Text>

        <View className="bg-[#13131A] border border-[#22222E] rounded-2xl px-6 py-4 mb-10 w-full items-center">
          <Text className="text-[#5A5A72] text-xs font-medium mb-1">
            Booking ID
          </Text>
          <Text className="text-white font-bold text-lg">
            #{(bookingId as string)?.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(main)/bookings")}
          className="bg-[#E8500A] rounded-2xl py-5 mb-4 w-full items-center"
        >
          <Text className="text-white font-bold text-sm tracking-widest uppercase">
            View My Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/(main)/home")}
          className="border border-[#22222E] rounded-2xl py-5 w-full items-center"
        >
          <Text className="text-white font-semibold text-sm tracking-widest uppercase">
            Back to Home
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}
