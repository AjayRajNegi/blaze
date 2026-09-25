import { api } from "@/lib/axios";
import type { Booking } from "../../backend/generated/prisma/client";

export const bookingService = {
	async createBooking(data: {
		userId: string;
		carId: string;
		startTime: string;
		endTime: string;
	}): Promise<Booking> {
		const res = await api.post("/bookings", data);
		console.log("RAW:", JSON.stringify(res, null, 2));
		return res.data.data;
	},
	async getMyBookings(status?: string): Promise<Booking[]> {
		const res = await api.get("/bookings", {
			params: status ? { status } : {},
		});
		return res.data.data;
	},

	async getBookingById(id: string): Promise<Booking> {
		const res = await api.get(`/bookings/${id}`);
		return res.data.data;
	},

	async cancelBooking(id: string): Promise<Booking> {
		const res = await api.patch(`/bookinga/${id}/cancel`);
		return res.data.data;
	},
};
