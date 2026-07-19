import { carsService } from "@/services/cars.service";
import { useBookingStore } from "@/store/booking.store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FUEL_COLORS: Record<string, string> = {
  PETROL: "#4CAF5Ø",
  DIESEL: "#FF9800",
  ELECTRIC: "#2196F3",
  CNG: "#9C27B0",
};

const FUEL_LABELS: Record<string, string> = {
  PETROL: "Petrol",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  CNG: "CNG",
};

export default function carDetail() {
  const { draft } = useBookingStore();
  const car = draft.car;

  const [pricing, setPricing] = useState<any>(null);
  const [loadingPrice, setLoadingPrice] = useState(true);

  useEffect(() => {
    if (car && draft.startTime && draft.endTime) {
      loadPricing();
    }
  }, []);

  const loadPricing = async () => {
    try {
      const data = await carsService.calculatePrice({
        carId: car!.id,
        startTime: draft.startTime!.toISOString(),
        endTime: draft.endTime!.toISOString(),
      });

      setPricing(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPrice(false);
    }
  };

  useEffect(() => {
    if (!car) router.back();
  }, [car]);

  if (!car) return null;

  if (!car) {
    router.back();
    return null;
  }

  const fuelColor = FUEL_COLORS[car?.fuelType] || "#9494a8";

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
      <View className="flex-row items-center justify-between px-6 pt-4 pb-4">
        <TouchableOpacity
          className="w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold text-base">←</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-base">Car Details:</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View
          className="bg-white mx-6 rounded-3xl overflow-hidden mb-6"
          style={{ height: 220 }}
        >
          <Image
            source={{ uri: car.images[0] }}
            className="w-full h-44"
            resizeMode="contain"
          />
          <View
            style={{ backgroundColor: fuelColor + "20" }}
            className="absolute top-3 left-3 rounded-xl px-3 py-1"
          >
            <Text className="text-xs font-bold">
              {FUEL_LABELS[car.fuelType]}
            </Text>
          </View>
          <View className="absolute top-3 right-3 bg-white/80 border-gray-200 rounded-xl px-3 py-1">
            <Text className="text-gray-600 text-xs font-semibold">
              {car.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
            </Text>
          </View>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-white font-bold text-3xl leading-tight">
                {car.name}
              </Text>
              <Text className="text-[#9494A8] text-base font-medium mt-1">
                {car.brand}-{car.year}
              </Text>
            </View>

            <View className="items-end">
              <Text className="font-bold text-3xl">
                ₹{car.pricePerDay.toLocaleString()}
              </Text>
              <Text className="text-[#9494A8] text-sm font-medium">
                per day
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 bg-[#13131A] border border-[#22222E] rounded-3xl p-5 mb-6">
          <Text className=" text-[#9494a8] text-xs font-bold tracking-widest uppercase mb-4">
            Pickup Details
          </Text>

          <View className="flex-row mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-#9494A8] text-xs font-semibold uppercase tracking-wider mb-1">
                From
              </Text>
              <Text className="text-white font-bold text-base">
                {draft.sublocation?.name}
              </Text>
              <Text className="text-[#5a5a72] text-xs mt-0.5">
                {draft?.sublocation?.address}
              </Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className=" text-[#9494A8] text-xs font-semibold uppercase tracking-wider mb-1">
                City
              </Text>
              <Text className="text-white font-bold text-base">
                {draft.city?.name}
              </Text>
              <Text className="•text-[#5A5A72] text-xs mt-0.5">
                {draft.city?.state}
              </Text>
            </View>
          </View>

          <View className="h-px bg-[#22222e] mb-4" />

          <View className="flex-row ">
            <View className="flex-1 mr-3">
              <Text className=" text-[#9494a8] text-xs font-semibold tracking-wider uppercase mb-1">
                Pickup
              </Text>
              <Text className="text-white font-bold text-base">
                {draft?.startTime ? formatDate(draft.startTime) : "-"}
              </Text>
              <Text className="text-[#5a5a72] text-xs mt-0.5">
                {draft?.startTime ? formatTime(draft.startTime) : "-"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
