import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    tag: "WELCOME TO DRIVEINDIA",
    title: "Drive Anywhere, VhAnytime.",
    subtitle:
      "Premium self-drive cars available across Bengaluru, Mumbai & Hyderabad. ",
    image:
      "https://sslphotos.jato.com/PHOT0400/SSCIND/HYUNDAI/EXTER/2023/50D.JPG",
    accentClass: "bg-[#E8500A]",
    accentText: "text-[#E8500A]",
    btnClass: "bg-[#E8500A]",
  },
  {
    id: "2",
    tag: "EASY BOOKING",
    title: "Book in Under\n60 Seconds.",
    subtitle:
      "Choose your city, pick a location near you, select your car and go.",
    image:
      "https://sslphotos.jato.com/PHOT0400/SSCIND/MARUTI%20SUZUKI/SWIFT/2023/5HA.JPG",
    accentClass: "bg-[#00D4AA]",
    accentText: "text-[#00D4AA]",
    benClass: "bg-[#00D4AA]",
  },
  {
    id: "3",
    tag: "YOUR TERMS",
    title: "Fuel Up &\nDrive Free.",
    subtitle:
      "Transparent pricing, daily km limits and zero hidden charges. Always.",
    image:
      "https://sslphotos.jato.com/PHOT0400/SSCIND/TOYOTA/GLANZA/2023/5HA.JPG",
    accentClass: "bg-[#E85Ø0A]",
    accentText: "text-[#E8500A]",
    btnClass: "bg-[#E8500A]",
  },
];

export default function onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View>
        {activeIndex < slides.length - 1 ? (
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login" as any)}
            className="py-2 px-4"
          >
            <Text className=" text-[#5A5A72] text-sm font-medium tracking-widest uppercase">
              Skip{" "}
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="py-2 px-4 opacity-0">
            <Text>Skip</Text>
          </View>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={false}

        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="px-6" style={{ width }}>
            <View
              className="rounded-3xl
bg-[#13131A] border border-[#22222E] h-80 overflow-hidden mb-10 items-center justify-center"
            >
              <View className="absolute top-4 left-4 bg-[#0A0A0F] rounded-full px-3 py-1 border border-[#22222E]">
                <Text className="text-[#9494A8] text-sm tracking-widest uppercase">
                  Self Drive
                </Text>
              </View>
              <Image
                source={{ uri: item?.image }}
                className="w-full h-52 "
                resizeMode="contain"
              />

              <View
                className={`absolute bottom-0 left-0 right-0 h-1 ${item.accentClass} opacity-60`}
              />
            </View>

            <View>
              <View>
                <View className={`w-5 h-0.5 mr-2 ${item.accentClass}`} />
                <Text
                  className={`text-s font-bold tracking-[3px] ${item.accentText}`}
                >
                  {item?.tag}
                </Text>
              </View>

              <Text className="text-white font-bold text-5xl leading-tight mb-4">
                {item?.title}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
