import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitor extends Document {
    visitorId: string;
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    userAgent?: string;
    ipHash?: string;
    referrer?: string;
    firstSeen: Date;
    lastSeen: Date;
    visitCount: number;
    consentedAt?: Date;
}

const VisitorSchema = new Schema<IVisitor>(
    {
        visitorId: { type: String, required: true, unique: true, index: true },
        name: { type: String },
        email: { type: String },
        phone: { type: String },
        location: { type: String },
        userAgent: { type: String },
        ipHash: { type: String },
        referrer: { type: String },
        firstSeen: { type: Date, default: Date.now },
        lastSeen: { type: Date, default: Date.now },
        visitCount: { type: Number, default: 1 },
        consentedAt: { type: Date },
    },
    { timestamps: true }
);

const Visitor: Model<IVisitor> =
    mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", VisitorSchema);

export default Visitor;
