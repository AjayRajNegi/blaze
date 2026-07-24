import { bookingService } from "@/services/bookings.service";
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

  const totalHours = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
  );

  const totalDays = Math.ceil(totalHours / 24);
  const totalPrice = car.pricePerDay * totalDays;
  const kmLimitTotal = car.kmLimitPerDay * totalDays;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const booking = await bookingService.createBooking({
        carId: car.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      router.dismissAll();
      router.replace({
        pathname: "/(main)/booking-success",
        params: { bookingId: booking.id },
      });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Booking failed. lease try again.";
    } finally {
      setLoading(false);
    }
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

            <View className="flex-row border-t border-[#22222e]">
              <View className="flex-1 py-3 items-center border-r border-[#22222e]">
                <Text className="text-white font-bold text-xl">
                  {totalDays}
                </Text>
                <Text className="text-[#9494ab] text-xs font-medium">Days</Text>
              </View>
              <View className="flex-1 py-3 items-center border-r border-[#22222e]">
                <Text className="text-white font-bold text-xl">
                  {totalHours}
                </Text>
                <Text className="text-[#9494ab] text-xs font-medium">
                  Hours
                </Text>
              </View>
              <View className="flex-1 py-3 items-center border-r border-[#22222e]">
                <Text className="text-white font-bold text-xl">
                  {kmLimitTotal}
                </Text>
                <Text className="text-[#9494ab] text-xs font-medium">
                  KM Limit
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mx-6 mb-6 ">
          <Text className="text-white font-bold text-xl mb-4">
            Pricing Breakdown
          </Text>
          <View className="bg-[#13131a] border border-[#22222e] rounded-3xl overflow-hidden ">
            {[
              {
                label: `Daily Rate <> ${totalDays} day${totalDays > 1 ? "s" : ""})`,
                value: `₹${car.pricePerDay.toLocaleString()}`,
              },
              {
                label: "KM Limit",
                value: `${kmLimitTotal} km total`,
              },
              {
                label: "Extra KM Charge",
                value: `${car.extraKmCharge}/km`,
              },
              {
                label: "Taxes & Fee",
                value: `Included`,
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

            <View className="flex-row items-center justify-between py-4">
              <Text className="text-white font-bold text-lg">Total Amount</Text>
              <Text className="text-[#e8500a] font-bold text-3xl">
                ₹{totalPrice.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View className="mx-6 bg-[#00d4aa10] border border-[#00d4aa30] rounded-3xl px-4 py-4">
          <Text className="text-[#00d4aa] text-xs font-bold tracking-widest uppercase mb-2">
            Cancellation Policy
          </Text>
          <Text className="text-[#9494ab] text-sm leading-6">
            Free Cancellation up to 1 hour before pickup, No refund after that.
          </Text>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-[#0a0a0f] border-t border-[#22222e]">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-[39494a8] text-xs font-medium">
              Total Payable{" "}
            </Text>
            <Text>₹{totalPrice.toLocaleString()}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[#9494a8] text-xs font-medium">Duration</Text>
            <Text className="">
              {totalDays} day{totalDays > 1 ? "s" : ""} • {totalHours}s
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={loading}
          activeOpacity={0.85}
          className="bg-[#e8500a] rouned-2xl py-5 items-center"
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color={"#fff"} size={"small"} />
              <Text>Confirming Booking...</Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-base tracking-widest uppercase">
              Confirm & Book Now
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
