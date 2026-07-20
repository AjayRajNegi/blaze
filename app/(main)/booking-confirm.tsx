import { useBookingStore } from "@/store/booking.store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function bookingConfirm() {
  const { draft, resetDraft } = useBookingStore();
  const [loading, setLoading] = useState(false);

  const car = draft.car;
  const startTime = draft.startTime;
  const endTime = draft.endTime;

  useEffect(() => {
    if (!car || !startTime || !endTime) {
      router.back();
    }
  }, []);

  if (!car || !endTime || !startTime) {
    return <View className="flex-1 bg-[#0a0a0f]" />;
  }

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const formatTime = (d: Date) => {
    return d.toLocaleDateString("en IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      <View className="flex-row items-center justify-between px-6 pt-4 pb-4 ">
        <TouchableOpacity
          className="w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold text-base">←</Text>
        </TouchableOpacity>

        <Text className="text-white font-bold text-lg">Confirm Booking</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 13 }}
      >
        <View className="flex-row items-center px-6 mb-8">
          {["Select Car", "Review", "Confirm"].map((step, i) => (
            <View key={i} className="flex-row items-center flex-1">
              <View className="w-8 h-8 rounded-full items-center justify-center bg-[#e8500a]">
                <Text className="text-white text-xs font-bold">{i + 1}</Text>
              </View>
              <Text className="text-[#e8500a] text-xs mt-1 font-semibold">
                {step}
              </Text>
              {i < 2 && <View className="flex-1 h-px mx-2 mb-4 bg-[#e8500a]" />}
            </View>
          ))}
        </View>

        <View className="mx-6 bg-[#13131a] border border-[#22222e] rounded-3xl overflow-hidden mb-6">
          <View className="bg-white h-44 items-center justify-center">
            <Image
              className="w-full h-full"
              resizeMode="contain"
              source={{ uri: car.images[0] }}
            />
          </View>

          <View className="p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-bold text-2xl">
                  {car.name}
                </Text>
                <Text className="text-[#9494a8] text-sm font-medium mt-0.5">
                  {car.brand}-{car.year}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[#e8500a] font-bold text-2xl">
                  ₹{car.pricePerDay.toLocaleString()}
                </Text>
                <Text className="text-[#9494a8] text-xs font-medium">
                  per day
                </Text>
              </View>
            </View>

            <View className="flex-row mt-4">
              {[
                `${car.seats} Seats`,
                car.transmission === "AUTOMATIC" ? "Auto" : "Manual",
                car.fuelType,
              ].map((s, i) => (
                <View
                  key={i}
                  className="bg-[#0a0a0f] border border-[#22222e] rounded-3xl"
                >
                  <Text className="text-white text-xs font-semibold">{s}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="text-white font-bold text-xl mb-4">
            Trip Details
          </Text>
          <View className="bg-[#13131A] border •border-[#22222E] rounded-3xl overflow-hidden">
            <View className="p-5">
              <View className="flex-row items-stretch">
                <View className="mr-4 items-center">
                  <View className="w-3 h-3 rounded-full bg-[#E8500A]" />
                  <View className="w-px flex-1 Obg-[#22222E] my-1" />
                  <View className="w-3 h-3 rounded-fullbg-[#00D4AA]" />
                </View>
                <View className="flex-1 ">
                  <View className="mb-5">
                    <Text className="text-[#e8500a] text-xs font-bold tracking-widest uppercase mb-1">
                      Pickup
                    </Text>
                    <Text className="text-white font-bold text-base">
                      {formatDate(startTime)}
                    </Text>
                    <Text className="text-[#9494a8] text-sm font-medium">
                      {formatTime(startTime)} • {draft.sublocation?.name}
                    </Text>
                    <Text
                      className="text-[#5A5A72] text-s mt-0.5"
                      numberOfLines={1}
                    >
                      {draft.sublocation?.address}
                    </Text>
                  </View>

                  <View>
                    <Text className="text-[#e8500a] text-xs font-bold tracking-widest uppercase mb-1">
                      Return
                    </Text>
                    <Text className="text-white font-bold text-base">
                      {formatDate(endTime)}
                    </Text>
                    <Text className="text-[#9494a8] text-sm font-medium">
                      {formatTime(endTime)} • {draft.sublocation?.name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
