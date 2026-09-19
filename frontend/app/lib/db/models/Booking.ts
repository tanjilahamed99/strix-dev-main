import mongoose, { Schema, Document, Model } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "rejected" | "cancelled";

export interface IBooking extends Document {
    bookingId: string;
    visitorId?: string;
    name: string;
    email: string;
    phone?: string;
    topic: string;
    date: string;
    timeSlot: string;
    timezone?: string;
    message?: string;
    status: BookingStatus;
    meetLink?: string;
    calendarEventId?: string;
    calendarHtmlLink?: string;
    declineReason?: string;
    createdAt: Date;
    confirmedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        bookingId: { type: String, required: true, unique: true, index: true },
        visitorId: { type: String, index: true },
        name: { type: String, required: true },
        email: { type: String, required: true, index: true },
        phone: { type: String },
        topic: { type: String, required: true },
        date: { type: String, required: true },
        timeSlot: { type: String, required: true },
        timezone: { type: String },
        message: { type: String },
        status: {
            type: String,
            enum: ["pending", "confirmed", "rejected", "cancelled"],
            default: "pending",
            index: true,
        },
        meetLink: { type: String },
        calendarEventId: { type: String },
        calendarHtmlLink: { type: String },
        declineReason: { type: String },
        createdAt: { type: Date, default: Date.now },
        confirmedAt: { type: Date },
    },
    { timestamps: true }
);

const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
