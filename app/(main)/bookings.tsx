import { bookingService } from "@/services/bookings.service";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  FlatList,
  View,
} from "react-native-reanimated/lib/typescript/Animated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Booking } from "../../backend/generated/prisma/client";

type TabType = "ALL" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "Pending", color: "#FFB800", bg: "#FFB80015" },
  CONFIRMED: { label: "Confirmed", color: "#00D4AA", bg: "#00D4AA15" },
  ACTIVE: { label: "Active", color: "#2196F3", bg: "#2196F315" },
  COMPLETED: { label: "Completed", color: "#9494A8", bg: "#9494A815" },
  CANCELLED: { label: "Cancelled", color: "#FF4D4D", bg: "#FF4D4D15" },
};

const tabs: { label: string; value: TabType }[] = [
  { label: "All", value: "ALL" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (activeTab == "ALL") setFiltered(bookings);
    else setFiltered(bookings.filter((b) => b.status == activeTab));
  }, [bookings, activeTab]);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookings();
  }, []);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (s: string) =>
    new Date(s).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f] ">
      <View className="px-6 pt-4 pb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-[#13131a] border border-[#22222e] items-center justify-center"
        >
          <Text className="text-white font-bold text-base">←</Text>
        </TouchableOpacity>
        <Text className="text-[#9494A8] text-xs tracking-[3px] uppercase mb-1">
          Your Rides
        </Text>
        <Text className="text-white font-bold text-3xl">Bookings</Text>
      </View>

      <View className="mb-4">
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item.value)}
              className={`px-4 py-2 rounded-xl border ${activeTab === item.value ? "bg-[#e8500a] border-[#38500a]" : "bg-[#13131a] border-[#22222e]"}`}
            >
              <Text
                className={`text-sm font-semibold ${activeTab === item.value ? "text-white" : "text-gray-400"}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={"#e8500a"} size={"large"} />
          <Text className="text-[#5a5a72] text-sm mt-4">
            Loading Bookings...
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="'w-20 h-20 rounded-3xl bg-[#13131A] border border-[#22222E] items-center justify-center">
            <Text className="text-4xl">🚗</Text>
          </View>
          <Text className="text-white font-bold text-2xl mb-2">
            No Bookings
          </Text>
          <Text>
            {activeTab === "ALL"
              ? "You haven't made any bookings yet."
              : `No ${activeTab.toLowerCase()} bookings found.`}
          </Text>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={"#e8500a"}
            />
          }

          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              formatDate={formatDate}
              formatTime={formatTime}
              onCancel={handleCancel}
              cancelling={cancelling}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function BookingCard({
  booking,
  formatDate,
  formatTime,
  onCancel,
  cancelling,
}: {
  booking: Booking;
  formatDate: (s: string) => string;
  formatTime: (s: string) => string;
  onCancel: (id: string) => void;
  cancelling: string | null;
}) {
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.CONFIRMED;
  const canCancel =
    booking.status == "CONFIRMED" || booking.status === "PENDING";
  const isCancelling = cancelling === booking.id;

  return (
    <View
      className={
        "bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden"
      }
    >
      <View className="bg-white h-40 items-center justify-center relative">
        <Image
          className="w-full h-36"
          resizeMode="contain"
          source={{ uri: booking.car.images[0] }}
        />
        <View
          style={{ backgroundColor: status.bg }}
          className="absolute top-3 right-3 rounded-xl px-3 py-1.5"
        >
          <Text className="text-xs font-bold">{status.label}</Text>
        </View>

        <View className="absolute top-3 left-3 bg-black/30 rounded-xl px-3 py-1.5">
          <Text className="text-white text-xs font-bold">
            #{booking.id.slice(0, 6).toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1 mr-3">
            <Text className="text-white font-bold text-xl">
              {booking.car.name}
            </Text>
            <Text className="text-[#9494A8] text-sm font-medium mt-0.5">
              {booking.car.brand}•{booking.car.fuelType}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-[#e8500a] font-bold text-xl">
              ₹{booking.totalPrice.toLocaleString()}
            </Text>
            <Text className="text-[#5a5a72]">Total</Text>
          </View>
        </View>
      </View>

      <View className="bg-[#0a0a0f] border border-[#22222e] rounded-2xl p-4 mb-4">
        <View className="flex-row items-stretch">
          <View className="items-center mr-3">
            <View className="w-2.5 h-2.5 rounded-full bg-[#E8500A]" />
            <View className="w-px flex-1 bg-[#22222E] my-1" />
            <View className="w-2.5 h-2.5 rounded-full bg-[#00D4AA]" />
          </View>
          <View className="flex-1 ">
            <View className="mb-3">
              <Text className="text-[#e8500a] text-xs font-bold tracking-widest uppercase mb-1">
                Pickup
              </Text>
              <Text className="text-white font-bold text-base">
                {formatDate(booking.startTime)}
              </Text>
              <Text className="text-[#9494a8] text-sm font-medium">
                {formatTime(booking.startTime)}
              </Text>
            </View>

            <View>
              <Text className="text-[#00d4aa] text-xs font-bold tracking-wider uppercase mb-0.5">
                Return
              </Text>
              <Text className="text-white font-semibold text-sm">
                {formatDate(booking.endTime)}
              </Text>
              <Text className="text-[#9494a8] text-sm font-medium">
                {formatTime(booking.endTime)}
              </Text>
            </View>
          </View>

          <View className="items-end justify-between ">
            <View className="items-end">
              <Text className="text-white font-bold text-lg">
                {booking.totalHours}
              </Text>
              <Text className="text-[#5a5a72] text-xs">Duration</Text>
            </View>
            <View className="items-end">
              <Text className="text-white font-bold text-lg">
                {booking.kmLimitTotal}
              </Text>
              <Text className="text-[#5a5a72] text-xs">KM Limit</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center mb-4 mt-4">
          <View className="w-1.5 h-1.5 rounded-full bg-[#E8500A] mr-2" />
          <Text className="text-sm font-medium flex-1 text-[#9494a8]">
            {booking.car.sublocation.name} • {booking.car.sublocation.city.name}
          </Text>
        </View>
        <View
          className="flex-row pt-3 border-t border-[#22222E]"
          style={{ gap: 8 }}
        >
          {[
            `${booking.car.seats} Seats`,
            booking.car.transmission === "Automatic" ? "Auto" : "Manual",
            booking.car.fuelType,
          ].map((s, i) => (
            <View
              key={i}
              className="bg-[#0A0A0F] border border-[#22222E] rounded-xl px-3 py-1.5"
            >
              <Text className=" text-white text-xs font-semibold">{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {canCancel && (
        <TouchableOpacity
          disabled={isCancelling}
          onPress={() => onCancel(booking.id)}
          className="mt-4 py-4 rounded-2xl border border-[#FF4D4D40]
bg-[#FF4D4D10] items-center"
        >
          {isCancelling ? (
            <ActivityIndicator color={"#ff4dfd"} size={"small"} />
          ) : (
            <Text className="text-[#FF4D4D] font-bold text-sm tracking-widest uppercase">
              Cancel Booking
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
