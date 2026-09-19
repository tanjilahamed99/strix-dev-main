import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
    direction: "inbound" | "outbound";
    name?: string;
    email?: string;
    phone?: string;
    sentTo?: string;
    recipientName?: string;
    subject: string;
    body: string;
    status: "unread" | "read" | "replied" | "sent";
    visitorId?: string;
    bookingId?: string;
    sentAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        direction: {
            type: String,
            enum: ["inbound", "outbound"],
            default: "outbound",
            index: true,
        },
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        sentTo: { type: String },
        recipientName: { type: String },
        subject: { type: String, required: true },
        body: { type: String, required: true },
        status: {
            type: String,
            enum: ["unread", "read", "replied", "sent"],
            default: "unread",
            index: true,
        },
        visitorId: { type: String, index: true },
        bookingId: { type: String, index: true },
        sentAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
    delete mongoose.models.Message;
}

const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
