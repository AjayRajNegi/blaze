import { useAuthStore } from "@/store/auth.store";
import { City, Sublocations } from "@/types";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getGreeting() {
  const h = new Date().getHours();

  if (h < 12) return "Morning";
  else if (h < 17) return "Afternoon";
  return "Evening";
}

export default function home() {
  const { user } = useAuthStore();
  const [cities, setCities] = useState<City[]>([]);
  const [subLocations, setSubLocations] = useState<Sublocations[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<Sublocations[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);
  const [subSearch, setSubSearch] = useState("");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const [startTime, setStartTime] = useState<Date>(tomorrow);
  const [lendTime, setEndTime] = useState<Date>(dayAfter);

  const [showCityModal, setShowCityModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row items-center justify-between px-6 pt-6 pb-8">
          <View>
            <Text className="text-[#9494A8] text-sm font-semibold tracking-[3px] uppercase mb-1">
              Good {getGreeting()}
            </Text>
            <Text className="text-white font-bold text-3xl">
              {user?.firstName} {user?.lastName}
            </Text>
          </View>

          <TouchableOpacity className="w-14 h-14 rounded-2xl bg-[#E8500A] items-center justify-center">
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {user?.firstName?.[0].toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View className="mx-6 rounded-3xl bg-[#13131A] border border-[#22222E] overflow-hidden mb-8 ">
          <View className="p-6">
            <View className="bg-[#E8500A] self-start rounded-full px-4 py-1.5 mb-5">
              <Text className="text-white text-xs font-bold tracking-widest uppercase">
                Self Drive
              </Text>
            </View>
            <Text className="text-white font-bold leading-tight mb-2 text-4xl">
              Where to Today?
            </Text>
          </View>

          <View className="flex-row border-t border-[#22222E]">
            {[
              { label: "Cities", value: "3" },
              { label: "Locations", value: "75" },
              { label: "Cars", value: "150+" },
            ].map((stat, i) => (
              <View
                key={i}
                className={`flex-1 py-5 items-center ${i < 2 ? "border-r borer-[#22222E]" : ""}`}
              >
                <Text className="text-white font-bold text-2xl mb-0.5">
                  {stat.value}
                </Text>
                <Text className="text-[#5A5A72] text-sm font-medium">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
