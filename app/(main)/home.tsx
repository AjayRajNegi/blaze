import { citiesService } from "@/services/cities.service";
import { useAuthStore } from "@/store/auth.store";
import { useBookingStore } from "@/store/booking.store";
import type { City, Sublocations } from "@/types";
import DateTimePicker, {
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Platform,
	ScrollView,
	Text,
	TextInput,
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
	const { draft, setCity, setSublocation, setTime } = useBookingStore();
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
	const [endTime, setEndTime] = useState<Date>(dayAfter);
	const [showCityModal, setShowCityModal] = useState(false);
	const [showSubModal, setShowSubModal] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [androidStep, setAndroidStep] = useState<"date" | "time">("date");

	useEffect(() => {
		loadCities();
	}, []);

	useEffect(() => {
		if (!subSearch.trim()) {
			setFilteredSubs(subLocations);
		} else {
			const q = subSearch.toLowerCase();
			setFilteredSubs(
				subLocations.filter(
					(s) =>
						s.name.toLowerCase().includes(q) ||
						s.address.toLowerCase().includes(q),
				),
			);
		}
	}, [subSearch, subLocations]);

	const loadCities = async () => {
		try {
			const data = await citiesService.getCities();
			setCities(data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingCities(false);
		}
	};

	const formatDate = (d: Date) =>
		d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

	const formatTime = (d: Date) =>
		d.toLocaleTimeString("en-IN", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});

	const totalHours = Math.round(
		(endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
	);
	const totaldays = Math.ceil(totalHours / 24);
	const canSearch = !!draft.city && !!draft.sublocation;

	const handleSelectCity = useCallback(
		async (city: City) => {
			setCity(city);
			setSublocation(null as any);
			setShowCityModal(false);
			setLoadingSubs(true);
			setSubSearch("");
			try {
				const data = await citiesService.getSublocations(city.id);
				setSubLocations(data);
				setFilteredSubs(data);
			} catch (e) {
				console.error(e);
			} finally {
				setLoadingSubs(false);
			}
		},
		[setCity, setSublocation],
	);

	const handleSelectSub = useCallback(
		(sub: Sublocations) => {
			setSublocation(sub);
			setShowSubModal(false);
			setSubSearch("");
		},
		[setSublocation],
	);

	const handleSearch = useCallback(() => {
		if (!draft.city || !draft.sublocation) return;
		setTime(startTime, endTime);
		router.push("/(main)/cars");
	}, [draft.city, draft.sublocation, startTime, endTime, setTime]);

	const applyStart = (d: Date) => {
		setStartTime(d);
		if (endTime <= d) {
			const newEnd = new Date(d);
			newEnd.setDate(newEnd.getDate() + 1);
			setEndTime(newEnd);
		}
	};

	const onStartChange = (event: DateTimePickerEvent, date?: Date) => {
		if (Platform.OS === "android") {
			if (event.type === "dismissed") {
				setShowStartPicker(false);
				setAndroidStep("date");
				return;
			}
			if (!date) return;

			if (androidStep === "date") {
				const merged = new Date(startTime);
				merged.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
				applyStart(merged);
				setAndroidStep("time");
			} else {
				const merged = new Date(startTime);
				merged.setHours(date.getHours(), date.getMinutes(), 0, 0);
				applyStart(merged);
				setShowStartPicker(false);
				setAndroidStep("date");
			}
			return;
		}

		if (date) applyStart(date);
	};

	const onEndChange = (event: DateTimePickerEvent, date?: Date) => {
		if (Platform.OS === "android") {
			if (event.type === "dismissed") {
				setShowEndPicker(false);
				setAndroidStep("date");
				return;
			}
			if (!date) return;

			if (androidStep === "date") {
				const merged = new Date(endTime);
				merged.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
				setEndTime(merged);
				setAndroidStep("time");
			} else {
				const merged = new Date(endTime);
				merged.setHours(date.getHours(), date.getMinutes(), 0, 0);
				setEndTime(merged);
				setShowEndPicker(false);
				setAndroidStep("date");
			}
			return;
		}

		if (date) setEndTime(date);
	};

	// Pattern printing
	function pattern() {
		for (let i = 1; i < 4; i++) {
			for (let j = 1; j < 4; j++) {
				console.log(j);
				console.log("/n");
			}
		}
	}

	console.log(pattern());

	return (
		<SafeAreaView className="flex-1 bg-[#0A0A0F]">
			<ScrollView
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 40,
				}}
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

					<TouchableOpacity
						onPress={() => router.push("/(main)/profile")}
						className="w-14 h-14 rounded-2xl bg-[#E8500A] items-center justify-center"
					>
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
								className={`flex-1 py-5 items-center ${i < 2 ? "border-r border-[#22222E]" : ""}`}
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

				<View className="rounded-3xl bg-[#13131A]  border border-[#22222E] mx-6 p-5 mb-6">
					<Text className="text-white font-bold text-2xl mb-6">
						Plan You Ride
					</Text>

					<View className="mb-4">
						<Text className="text-[#9494A8] text-xs font-bold tracking-widest uppercase mb-2">
							City
						</Text>
						<TouchableOpacity
							onPress={() => setShowCityModal(true)}
							disabled={loadingCities}
							className="bg-[#0A0A0F] border border-[#22222E] rounded-2xl px-4 py-4 flex-row items-center justify-between"
						>
							<View className="flex-row items-center">
								<View
									className={`w-2.5 h-2.5 rounded-full mr-3 ${
										draft.city ? "bg-[#E8500A]" : "bg-[#22222E]"
									}`}
								/>
								<Text
									className={`text-lg font-semibold ${
										draft.city ? "text-white" : "text-[#5A5A72]"
									}`}
								>
									{draft?.city?.name || "Select City"}
								</Text>
							</View>
							{loadingCities ? (
								<ActivityIndicator size={"small"} color={"#E8500A"} />
							) : (
								<Text className="text-[#E8500A] font-bold text-2xl">{">"}</Text>
							)}
						</TouchableOpacity>
					</View>

					<View className="mb-6">
						<Text className="text-[#9494A8] text-xs font-bold tracking-widest uppercase mb-2">
							Pick up Point
						</Text>

						<TouchableOpacity
							disabled={!draft.city}
							onPress={() => draft.city && setShowSubModal(true)}
							className={`bg-[#0A0A0F] border border-[#22222E] rounded-2xl px-4 py-4 flex-row items-center justify-between ${
								!draft.sublocation
									? "opacity-40 border-[#22222E]"
									: "border-[#22222E]"
							}`}
						>
							<View className="flex-row items-center">
								<View
									className={`w-2.5 h-2.5 rounded-full mr-3 ${
										draft.sublocation ? "bg-[#E8500A]" : "bg-[#22222E]"
									}`}
								/>
								<Text
									className={`text-lg font-semibold ${
										draft.sublocation ? "text-white" : "text-[#5A5A72]"
									}`}
								>
									{draft?.sublocation?.name || "Select Pickup Point"}
								</Text>
							</View>
							{loadingSubs ? (
								<ActivityIndicator size={"small"} color={"#E8500A"} />
							) : (
								<Text className="text-[#E8500A] font-bold text-2xl">{">"}</Text>
							)}
						</TouchableOpacity>
						{draft.sublocation && (
							<Text
								className="text-[#5A5A72] text-sm mt-2 ml-6 font-medium"
								numberOfLines={1}
							>
								{draft.sublocation.address}
							</Text>
						)}
					</View>

					<View className="h-px mb-6 bg-[#22222E]" />

					<Text className="text-[#9494AB] text-xs font-bold tracking-widest uppercase mb-4">
						Rental Period
					</Text>

					<View className="flex-row mb-4 " style={{ gap: 10 }}>
						<TouchableOpacity
							onPress={() => {
								setAndroidStep("date");
								setShowStartPicker(true);
							}}
							className="flex-1 rounded-2xl p-4 bg-[#0A0A0F] border border-[#22222E]"
						>
							<Text className="text-[#E8500A] text-xs font-bold tracking-widest uppercase mb-2">
								Pickup
							</Text>
							<Text className="text-white font-bold text-2xl mb-1 ">
								{formatDate(startTime)}
							</Text>
							<Text className="text-[#9494AB] text-sm font-medium">
								{formatTime(startTime)}
							</Text>
						</TouchableOpacity>

						<View className="items-center justify-center px-1">
							<View className="w-px h-8 bg-[#22222E]" />
							<Text className="text-[#E8500A] font-bold text-xl my-1">→</Text>
							<View className="w-px h-8 bg-[#22222E]" />
						</View>

						<TouchableOpacity
							className="flex-1 rounded-2xl p-4 bg-[#0A0A0F] border border-[#22222E]"
							onPress={() => {
								setAndroidStep("date");
								setShowEndPicker(true);
							}}
						>
							<Text className="text-[#00D4AA] text-xs font-bold tracking-widest uppercase mb-2">
								Return
							</Text>
							<Text className="text-white font-bold text-2xl mb-1 ">
								{formatDate(endTime)}
							</Text>
							<Text className="text-[#9494AB] text-sm font-medium">
								{formatTime(endTime)}
							</Text>
						</TouchableOpacity>
					</View>

					<View className="bg-[#0A0A0F] border border-[#22222E] rounded-2xl px-4 py-4 flex-row justify-between items-center">
						<Text className="text-[#9494A8] text-base font-medium">
							Duration
						</Text>
						<View className="flex-row items-center" style={{ gap: 8 }}>
							<View className="bg-[#00D4AA20] rounded-xl  px-4 py-1.5">
								<Text className="text-[#E8500A] text-sm font-bold">
									{totaldays}D
								</Text>
							</View>
							<View className="bg-[#00D4AA20] rounded-xl  px-4 py-1.5">
								<Text className="text-[#00D4AA] text-sm font-bold">
									{totalHours}H
								</Text>
							</View>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleSearch}
						disabled={!canSearch}
						activeOpacity={0.85}
						className={`rounded-2xl py-5 items-center mt-4 ${
							canSearch ? "bg-[#E8500A]" : "bg-[#1C1C26]"
						}`}
					>
						<Text
							className={`font-bold text-base tracking-widest uppercase ${
								canSearch ? "text-white" : "text-[#5A5A72]"
							}`}
						>
							{canSearch ? "Search Available Cars" : "Select City & Location"}
						</Text>
					</TouchableOpacity>
				</View>

				{!loadingCities && cities.length > 0 && (
					<View className="mb-6">
						<Text className="text-white font-bold text-2xl px-6 mb-4">
							Quick Select
						</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="px-6"
						>
							<View className="flex-row" style={{ gap: 12 }}>
								{cities?.map((city) => (
									<TouchableOpacity
										key={city.id}
										onPress={() => setShowCityModal(true)}
										className={`px-5 py-4 rounded-2xl border ${
											draft.city?.id === city?.id
												? "bg-[#E8500A] border-[#E8500A]"
												: "bg-[#13131A] border-[#22222E]"
										}`}
									>
										<Text
											className={`text-base font-bold ${
												draft.city?.id === city.id
													? "text-white opacity-80"
													: "text-white"
											}`}
										>
											{city.name}
										</Text>
										<Text
											className={`text-sm mt-0.5 font-medium ${
												draft.city?.id === city.id
													? "text-white opacity-80"
													: "text-[#5A5A72]"
											}`}
										>
											{city._count.sublocations} locations
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</ScrollView>
					</View>
				)}

				<TouchableOpacity
					className="mx-6 bg-[#13131A] border border-[#22222E] rounded-3xl p-5 flex-row items-center justify-between"
					onPress={() => router.push("/(main)/bookings")}
				>
					<View>
						<Text className="text-white font-bold text-xl mb-1">
							My Bookings
						</Text>
						<Text className="text-[#5A5A72] text-base font-medium">
							View Active & Past rides
						</Text>
					</View>
					<View className="w-12 h-12 rounded-2xl bg-[#0A0A0F] border border-[#22222E] items-center justify-center">
						<Text className="text-[#E8500A] font-bold text-2xl">{">"}</Text>
					</View>
				</TouchableOpacity>
			</ScrollView>

			{/* City Modal */}
			<Modal
				visible={showCityModal}
				animationType="slide"
				transparent
				onRequestClose={() => setShowCityModal(false)}
			>
				<View className="flex-1 justify-end bg-black/60">
					<View className="bg-[#13131A] rounded-t-3xl pt-5 pb-10">
						<View className="w-10 h-1 rounded-full bg-[#22222E] self-center mb-6" />
						<Text className="text-white font-bold text-2xl px-6 mb-6">
							Select City
						</Text>

						{cities.map((city) => (
							<TouchableOpacity
								key={city.id}
								onPress={() => handleSelectCity(city)}
								className={`flex-row items-center justify-between px-6 py-4 rounded-2xl mb-3 mx-4 ${
									draft.city?.id === city.id
										? "bg-[#E8500A15] border border-[#E8500A40]"
										: "bg-[#0A0A0F] border border-[#22222E]"
								}`}
							>
								<View>
									<Text
										className={`font-bold text-lg ${
											draft.city?.id === city.id
												? "text-[#E8500A]"
												: "text-white"
										}`}
									>
										{city.name}
									</Text>
									<Text className="text-[#5A5A72] text-sm font-medium mt-0.5">
										{city._count.sublocations} locations
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</Modal>

			{/* Sublocation Modal */}
			<Modal
				visible={showSubModal}
				animationType="slide"
				transparent
				onRequestClose={() => setShowSubModal(false)}
			>
				<View className="flex-1 justify-end bg-black/60">
					<View
						className="bg-[#13131A] rounded-t-3xl pt-5 pb-10"
						style={{ maxHeight: "80%" }}
					>
						<View className="w-10 h-1 rounded-full bg-[#22222E] self-center mb-6" />
						<Text className="text-white font-bold text-2xl px-6 mb-2">
							Pickup Point
						</Text>
						<Text className="text-[#5A5A72] text-base font-medium px-6 mb-4">
							{draft?.city?.name} · {subLocations.length} locations
						</Text>

						<View className="mx-4 mb-4 bg-[#0A0A0F] border border-[#22222E] rounded-2xl px-4 py-3.5 flex-row items-center">
							<Text className="text-[#5A5A72] mr-2 text-base">🔎</Text>
							<TextInput
								value={subSearch}
								onChangeText={setSubSearch}
								placeholder="Search Location"
								placeholderTextColor="#5A5A72"
								className="flex-1 text-white text-base"
								autoCorrect={false}
							/>
						</View>

						<FlatList
							data={filteredSubs}
							keyExtractor={(item) => item.id}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{
								paddingHorizontal: 16,
								paddingBottom: 10,
								gap: 8,
							}}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => handleSelectSub(item)}
									className={`flex-row items-center justify-between py-4 px-4 rounded-2xl ${
										draft.sublocation?.id === item.id
											? "bg-[#E8500A15] border border-[#E8500A40]"
											: "bg-[#0A0A0F] border border-[#22222E]"
									}`}
								>
									<View className="flex-1 mr-3">
										<Text
											className={`font-bold text-base ${
												draft.sublocation?.id === item?.id
													? "text-[#E8500A]"
													: "text-white"
											}`}
										>
											{item.name}
										</Text>
										<Text
											className="text-[#5A5A72] text-sm font-medium mt-0.5"
											numberOfLines={1}
										>
											{item.address}
										</Text>
									</View>
									{draft?.sublocation?.id === item?.id && (
										<View className="w-7 h-7 rounded-full bg-[#E8500A] items-center justify-center ">
											<Text className="text-white text-sm font-bold">✓</Text>
										</View>
									)}
								</TouchableOpacity>
							)}
						/>
					</View>
				</View>
			</Modal>

			{/* Start Picker */}
			{showStartPicker &&
				(Platform.OS === "ios" ? (
					<Modal
						visible
						animationType="slide"
						transparent
						onRequestClose={() => setShowStartPicker(false)}
					>
						<View className="flex-1 justify-end bg-black/60">
							<View className="bg-[#13131A] rounded-t-3xl pt-5 pb-10">
								<View className="w-10 h-1 rounded-full bg-[#22222E] self-center mb-4" />
								<Text className="text-white font-bold text-xl px-6 mb-2">
									Pickup Date & Time
								</Text>

								<DateTimePicker
									value={startTime}
									mode="datetime"
									display="spinner"
									minimumDate={new Date()}
									onChange={onStartChange}
									textColor="FFFFFF"
									themeVariant="dark"
									style={{ backgroundColor: "#13141A" }}
								/>

								<View className="flex-row mx-4 mt-2" style={{ gap: 10 }}>
									<TouchableOpacity
										className="flex-1 py-4 rounded-2xl border border-[#22222E] items-center"
										onPress={() => setShowStartPicker(false)}
									>
										<Text className="text-[#9494A8] font-semibold text-base">
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className="flex-1 py-4 rounded-2xl bg-[#E8500A] items-center"
										onPress={() => setShowStartPicker(false)}
									>
										<Text className="text-white font-bold text-base">
											Confirm
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
				) : (
					<DateTimePicker
						value={startTime}
						mode={androidStep}
						display="default"
						minimumDate={androidStep === "date" ? new Date() : undefined}
						onChange={onStartChange}
					/>
				))}

			{/* End Picker */}
			{showEndPicker &&
				(Platform.OS === "ios" ? (
					<Modal
						visible
						animationType="slide"
						transparent
						onRequestClose={() => setShowEndPicker(false)}
					>
						<View className="flex-1 justify-end bg-black/60">
							<View className="bg-[#13131A] rounded-t-3xl pt-5 pb-10">
								<View className="w-10 h-1 rounded-full bg-[#22222E] self-center mb-4" />
								<Text className="text-white font-bold text-xl px-6 mb-2">
									Return Date & Time
								</Text>

								<DateTimePicker
									value={endTime}
									mode="datetime"
									display="spinner"
									minimumDate={new Date(startTime.getTime() + 60 * 60 * 1000)}
									onChange={onEndChange}
									textColor="FFFFFF"
									themeVariant="dark"
									style={{ backgroundColor: "#13141A" }}
								/>

								<View className="flex-row mx-4 mt-2" style={{ gap: 10 }}>
									<TouchableOpacity
										className="flex-1 py-4 rounded-2xl border border-[#22222E] items-center"
										onPress={() => setShowEndPicker(false)}
									>
										<Text className="text-[#9494A8] font-semibold text-base">
											Cancel
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className="flex-1 py-4 rounded-2xl bg-[#E8500A] items-center"
										onPress={() => setShowEndPicker(false)}
									>
										<Text className="text-white font-bold text-base">
											Confirm
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
				) : (
					<DateTimePicker
						value={endTime}
						mode={androidStep}
						display="default"
						minimumDate={new Date(startTime.getTime() + 60 * 60 * 1000)}
						onChange={onEndChange}
					/>
				))}
		</SafeAreaView>
	);
}
