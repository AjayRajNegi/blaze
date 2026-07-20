import { carsService } from "@/services/cars.service";
import { useBookingStore } from "@/store/booking.store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const specItems = [
    { label: "Fuel Type", value: FUEL_LABELS[car.fuelType] },
    {
      label: "Transmission",
      value: car.transmission === "AUTOMATIC" ? "Automatic" : "Manual",
    },
    { label: "Seats", value: `${car.seats} Persons` },
    { label: "Year", value: `${car.year}` },
    {
      label: "KM Limit",
      value: "$(car.kmLimitPerDay} km/day",
    },
    { label: "Extra KM", value: `${car.extraKmCharge}/km` },
  ];
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
            <View className="w-px bg-[#22222e]" />
            <View className="flex-1 mr-3">
              <Text className=" text-[#9494a8] text-xs font-semibold tracking-wider uppercase mb-1">
                Return
              </Text>
              <Text className="text-white font-bold text-base">
                {draft?.endTime ? formatDate(draft.endTime) : "-"}
              </Text>
              <Text className="text-[#5a5a72] text-xs mt-0.5">
                {draft?.endTime ? formatTime(draft.endTime) : "-"}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="text-white font-bold text-xl mb-4">
            Specifications
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 10 }}>
            {specItems.map((spec, i) => (
              <View
                key={i}
                className="bg-[#13131a] border border-[#22222e]"
                style={{ width: "47%" }}
              >
                <Text className="text-[#9494A8] text-xs font-semibold uppercase tracking-wider mb-1">
                  {spec.label}
                </Text>
                <Text className="text-white font-bold text-base">
                  {spec.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mx-6 mb-6">
          <Text className="text-white font-bold text-xl mb-4">Features</Text>
          <View className="flex-row flex-wrap">
            {car.features.map((f, i) => (
              <View
                key={i}
                className="bg-[#13131a] border border-[#22222e] rounded-2xl px-4 py-2.5 flex-row items-center"
              >
                <View className="w-1.5 h-1.5 rounded-full bg-[#e8500a] mr-2" />
                <Text className="text-white text-sm font-semibold">{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mx-6 mb-6 ">
          <Text className="text-white font-bold text-xl mb-4">
            Pricing Breakdown
          </Text>
          <View className="bg-[#13131a] border border-[#22222e] rounded-3xl overflow-hidden ">
            {loadingPrice ? (
              <View>
                <ActivityIndicator color={"e8500a"} />
              </View>
            ) : pricing ? (
              <>
                {[
                  {
                    label: `Base Price (${pricing.days} day${pricing.days > 1 ? "s" : ""})`,
                    value: `7${pricing.basePrice.toLocaleString()}`,
                    highlight: false,
                  },
                  {
                    label: "KM Limit",
                    value: `${pricing.kmLimitTotal} km total`,
                    highlight: false,
                  },
                  {
                    label: "Extra KM Charge",
                    value: `${pricing.extraKmCharge}/km`,
                    highlight: false,
                  },
                  {
                    label: "Hourly Rate",
                    value: `${pricing.pricePerHour}/hr`,
                    highlight: false,
                  },
                ].map((row, i, arr) => (
                  <View
                    key={i}
                    className={`flex-row items-center justify-between px-5 py-4 ${i < arr.length - 1 ? "border-b border-[#22222e]" : ""}`}
                  >
                    <Text className="text-[9494a8] text-sm font-medium">
                      {row.label}
                    </Text>
                    <Text className="text-white font-bold text-sm">
                      {row.value}
                    </Text>
                  </View>
                ))}
              </>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-[#0A0A0F] border-t border-[#22222E]">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(main)/booking-confirm")}
          className="bg-[#E8500A] rounded-2xl py-5 items-center"
        >
          <Text className="text-white font-bold text-base tracking-widest uppercase">
            Confirm Booking •{" "}
            {pricing ? `7${pricing.basePrice.toLocaleString()}` : "..."}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
