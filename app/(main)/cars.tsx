import { carsService } from "@/services/cars.service";
import { useBookingStore } from "@/store/booking.store";
import { Car } from "@/types";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

type FilterType =
  "ALL" | "PETROL" | "DIESEL" | "ELECTRIC" | "CNG" | "MANUAL" | "AUTOMATIC";

const filters: { label: string; value: FilterType }[] = [
  { label: "All", value: "ALL" },
  { label: "Petrol", value: "PETROL" },
  { label: "Diesel", value: "DIESEL" },
  { label: "Electric", value: "ELECTRIC" },
  { label: "CNG", value: "CNG" },
  { label: "Manual", value: "MANUAL" },
  { label: "Auto", value: "AUTOMATIC" },
];

export default function cars() {
  const { draft, setCar } = useBookingStore();
  const [cars, setCars] = useState<Car[]>([]);
  const [filtered, setFiltered] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [sortBy, setSortBy] = useState<"price" | "seats">("price");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!draft.sublocation || !draft.startTime || !draft.endTime) {
      router.replace("/(main)/home");
      return;
    }
    setReady(true);
    loadCars();
  }, []);

  const loadCars = async () => {
    if (!draft.sublocation || !draft.startTime || !draft.endTime) return;
    try {
      const data = await carsService.getAvailableCars({
        sublocationId: draft.sublocation.id,
        startTime: draft.startTime.toISOString(),
        endTime: draft.endTime.toISOString(),
      });
      setCars(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    if (!ready) {
      return <View className="flex-1 bg-[#0A0A0F]" />;
    }
  };

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  };

  const totalDays =
    draft.startTime && draft.endTime
      ? Math.ceil(draft.endTime.getTime() - draft.startTime.getTime()) /
        (1000 * 60 * 60 * 24)
      : 1;

  const applyFilter = useCallback(() => {
    let result = [...cars];

    if (activeFilter !== "ALL") {
      if (["PETROL", "DIESEL", "ELECTRIC", "CNG"].includes(activeFilter)) {
        result = result.filter((c) => c.fuelType == activeFilter);
      } else result = result.filter((c) => c.transmission == activeFilter);
    }
    if (sortBy === "price") {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else {
      result.sort((a, b) => b.seats - a.seats);
    }
    setFiltered(result);
  }, [cars, activeFilter, sortBy]);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F] ">
      <View className="flex-row items-center px-6 pt-4 pb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="'w-10 h-10 rounded-2xl bg-[#13131A] border border-[#22222E] items-center justify-center"
        >
          <Text className="text-white font-bold text-base">←</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white font-bold text-xl">Available Cars</Text>
          <Text className="text-[#5A5A72] text-xs mt-0.5">
            {draft.sublocation?.name}·{formatDate(draft.startTime)}-
            {formatDate(draft.endTime)}
          </Text>
        </View>
      </View>

      <View className="mx-6 mb-4 bg-[#13131A] border border-[#22222E] rounded-2xl py-3 px-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-[#E8500A] mr-2" />
          <Text className="text-white text-sm font-semibold">
            {draft.city?.name}
          </Text>
        </View>
        <View className="w-px h-4 bg-[#22222E]" />
        <Text className="text-[#9494A8] text-sm">
          {totalDays} day{totalDays > 1 ? "s" : ""}
        </Text>
        <View className="w-px h-4 bg-[#22222E]" />
        <View className="bg-[#E8500A20] rounded-lg px-2 py-0.5">
          <Text className="bg-[#E8500A] text-xs font-bol">
            {loading ? "..." : `${filtered.length}`}
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 "
          contentContainerStyle={{ gap: 8 }}
        >
          {filters?.map((f) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(f.value)}
              key={f.value}
              className={`px-4 py-2 rounded-xl border ${activeFilter === f.value ? "bg-[#E8500A] border-[#E8500A]" : "bg-[#13131A] border-[#22222E]"}`}
            >
              <Text
                className={`text-xs font-semibold ${activeFilter == f.value ? "text-white" : "text-[#9494A8]"}`}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View className="flex-row items-center px-6 pb-4">
        <Text className="text-[#5A5A72] text-xs mr-3">Sort By:</Text>
        <TouchableOpacity
          onPress={() => setSortBy("price")}
          className={`px-3 py-1.5 rounded-lg mr-2 ${sortBy === "price" ? "bg-[#E8500A20]" : ""}`}
        >
          <Text
            className={`text-xs font-semibold ${sortBy === "price" ? "bg-[#e8500a]" : "text-[#5A5A72]"}`}
          >
            Price
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSortBy("seats")}
          className={`px-3 py-1.5 rounded-lg mr-2 ${sortBy === "seats" ? "bg-[#E8500A20]" : ""}`}
        >
          <Text
            className={`text-xs font-semibold ${sortBy === "seats" ? "bg-[#e8500a]" : "text-[#5A5A72]"}`}
          >
            Seats
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={"#e85a72"} />
          <Text className="text-[#5a5a72]">Finding Available Cars</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View>
          <Text className="text-white font-bold text-xl mb-2">
            No cars Available
          </Text>
          <Text className="text-sm leading-6 text-center text-[#5a5a72]">
            No cars match your filters for this slot
          </Text>
          <TouchableOpacity className="mt-6 bg-[#e8500a] px-6 py-3 rounded-2xl">
            <Text className="text-white font-bold text-sm">Clear Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 40,
            gap: 16,
          }}
          renderItem={({ item }) => (
            <CarCard
              car={item}
              totalDays={totalDays}
              onPress={() => handleSelectCar(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
