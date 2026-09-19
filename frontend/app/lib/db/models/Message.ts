import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
    visitorId?: string;
    bookingId?: string;
    sentTo: string;
    subject: string;
    body: string;
    sentAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        visitorId: { type: String, index: true },
        bookingId: { type: String, index: true },
        sentTo: { type: String, required: true },
        subject: { type: String, required: true },
        body: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
