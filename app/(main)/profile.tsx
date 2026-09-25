import { bookingService } from "@/services/bookings.service";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Text,
	TouchableOpacity,
} from "react-native";
import { View } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function profile() {
	const { user, logout, isLoading } = useAuthStore();
	const [stats, setStats] = useState({
		total: 0,
		confirmed: 0,
		completed: 0,
		cancelled: 0,
	});
	const [loadingStats, setLoadingStats] = useState(true);

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			const bookings = await bookingService.getMyBookings();
			setStats({
				total: bookings.length,
				confirmed: bookings.filter(
					(b) => b.status == "CONFIRMED" || b.status == "ACTIVE",
				),
				completed: bookings.filter((b) => b.status === "COMPLETED").length,
				cancelled: bookings.filter((b) => b.status === "CANCELLED").length,
			});
		} catch (e) {
			console.error(e);
		} finally {
			setLoadingStats(false);
		}
	};

	const handleLogout = () => {
		Alert.alert("Sign Out", "Are you sure you want to sign out?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Sign Out",
				style: "destructive",
				onPress: async () => {
					await logout();
					router.replace("/(auth)/login");
				},
			},
		]);
	};

	const initials =
		`${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

	const menuItems = [
		{
			section: "Account",
			items: [
				{
					label: "My Bookings",
					sub: "View all your rides",
					onPress: () => router.push("/(main)/bookings"),
					arrow: true,
				},
				{
					label: "Book a Car",
					sub: "Start a new booking",
					onPress: () => router.push("/(main)/home"),
					arrow: true,
				},
			],
		},

		{
			section: "Support",
			items: [
				{
					label: "Help & Support",
					sub: "FAQs and contact",
					onPress: () => {},
					arrow: true,
				},
				{
					label: "Terms of Service",
					sub: "Read our terms",
					onPress: () => {},
					arrow: true,
				},
				{
					label: "Privacy Policy",
					sub: "How we use your data",
					onPress: () => {},
					arrow: true,
				},
			],
		},
	];

	return (
		<SafeAreaView className="flex-1 bg-[#0a0a0f]">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 40 }}
			>
				<View className="px-6 pt-4 pb-8">
					<TouchableOpacity
						onPress={() => router.back()}
						className="w-10 h-10 rounded-2xl bg-[#13131a] border border-[#22222e] items-center justify-center"
					>
						<Text className="text-white font-bold text-base">←</Text>
					</TouchableOpacity>
					<Text className="text-[#9494A8] text-xs tracking-[3px] uppercase mb-1">
						Account
					</Text>
					<Text className=" text-white font-bold text-3×l">Profile</Text>
				</View>

				{/* Info card*/}
				<View>
					<View>
						<View className="w-20 h-20 rounded-2xl bg-[#E8500A] items-center justify-center mr-5">
							<Text
								style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "bold" }}
							>
								{initials}
							</Text>
						</View>

						{/* Info */}
						<View className="flex-1">
							<Text
								style={{ color: "#FFFFFF", fontSize: 22, fontWeight: "bold" }}
							>
								{user?.firstName} {user?.lastName}
							</Text>
							<Text style={{ color: "#9494A8", fontSize: 13, marginTop: 4 }}>
								{user?.email}
							</Text>
							<Text style={{ color: "#9494A8", fontSize: 13, marginTop: 2 }}>
								+91 {user?.phone}
							</Text>
						</View>
					</View>

					<View className="mt-5 pt-4 border-t border-[#22222e] flex-row items-center justify-between">
						<View className="flex-row items-center">
							<View
								className={`w-2 h-2 rounded-full mr-2 ${user?.isVerified ? "bg-[#00D4aa]" : "bg-yellow-500"}`}
							/>
							<Text
								style={{
									color: user?.isVerified ? "#00d4aa" : "#ffb800",
									fontSize: 13,
									fontWeight: 400,
								}}
							>
								{user?.isVerified ? "Verified Account" : "Verification Pending"}
							</Text>
						</View>

						<View className="bg-[#E8500A20] rounded-xl px-3 py-1">
							<Text
								style={{ color: "#E8500A", fontSize: 11, fontWeight: "bold" }}
							>
								{user?.role}
							</Text>
						</View>
					</View>
				</View>

				{/* Stats */}
				<View className="mx-6 mb-6">
					<Text className="text-white font-bold text-xl mb-4">Your Stats</Text>
					{loadingStats ? (
						<View className=" bg-[#13131A] border Oborder-[#22222E] rounded-3x1 py-8 items-center">
							<ActivityIndicator color={"#E850ØA"} />
						</View>
					) : (
						<View className="bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden">
							<View className="flex-row">
								{[
									{
										label: "Total",
										value: stats.total,
										color: "#E8500A",
									},
									{ label: "Active", value: stats.confirmed, color: "#00d4aa" },
									{ label: "Done", value: stats.completed, color: "#9494a8" },
								].map((stat, i) => (
									<View
										key={i}
										className={`flex-1 py-5 items-center ${i < 2 ? "border-r border-[#22222e]" : ""}`}
									>
										<Text
											className="font-bold text-3xl mb-1"
											style={{ color: stat.color }}
										>
											{stat.value}
										</Text>
										<Text className="text-[#9494A8] text-xs font-medium">
											(stat.label)
										</Text>
									</View>
								))}
							</View>

							{/* Cancelled */}
							{stats.cancelled > 0 && (
								<View className="border-t border-[#22222E] px-5 py-3 flex-row items-center justify-between">
									<Text className=" text-[#9494A8] text-sm font-medium">
										Cancelled bookings
									</Text>
									<Text className="text-[#FF4D4D] font-bold text-base">
										{stats.cancelled}
									</Text>
								</View>
							)}
						</View>
					)}
				</View>

				{/* Menu Section */}
				{menuItems.map((section, si) => (
					<TouchableOpacity key={si} className="mx-6 mb-6">
						<Text className="text-[#9494A8] text-xs font-bold tracking-[3px] uppercase mb-3">
							{section.section}
						</Text>
						<View className="bg-[#13131A] border border-[#22222E] rounded-3xl overflow-hidden">
							{section.items.map((item, ii) => (
								<TouchableOpacity
									key={ii}
									onPress={item.onPress}
									activeOpacity={0.7}
									className={`flex-row items-center justify-between px-5 py-4 ${ii < section.items.length - 1 ? "border-red" : "border-white"}`}
								>
									<View className="flex-1">
										<Text className=" text-white font-semibold text-base">
											(item.label)
										</Text>
										<Text className=" text-[#5A5A72] text-xs mt-0.5">
											{item.sub}
										</Text>
									</View>
									{item.arrow && (
										<Text className="text-[#E8500a] font-bold text-xl ml-3">
											˃
										</Text>
									)}
								</TouchableOpacity>
							))}
						</View>
					</TouchableOpacity>
				))}

				{/* App info */}
				<View className="mx-6">
					<TouchableOpacity
						onPress={handleLogout}
						disabled={isLoading}
						activeOpacity={0.85}
						className="border border-[#ff4d4d4d] bg-[#ff4df410] rounded-2xl py-5 items-center"
					>
						{isLoading ? (
							<ActivityIndicator color="#FF4D4D" size="small" />
						) : (
							<Text className="text-[#FF4D4D] font-bold text-sm tracking-widest uppercase">
								Sign Out
							</Text>
						)}
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
