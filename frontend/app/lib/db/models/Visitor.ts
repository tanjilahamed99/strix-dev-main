import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitor extends Document {
    visitorId: string;
    name?: string;
    email?: string;
    phone?: string;
    ip?: string;
    ipHash?: string;
    country?: string;
    countryCode?: string;
    city?: string;
    region?: string;
    location?: string;
    timezone?: string;
    device?: string;
    browser?: string;
    os?: string;
    screen?: string;
    language?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    firstSeen: Date;
    lastSeen: Date;
    visitCount: number;
    consentedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
    {
        visitorId: { type: String, required: true, unique: true, index: true },
        name: { type: String, index: true },
        email: { type: String, index: true },
        phone: { type: String },
        ip: { type: String },
        ipHash: { type: String },
        country: { type: String },
        countryCode: { type: String },
        city: { type: String },
        region: { type: String },
        location: { type: String },
        timezone: { type: String },
        device: { type: String },
        browser: { type: String },
        os: { type: String },
        screen: { type: String },
        language: { type: String },
        userAgent: { type: String },
        referrer: { type: String },
        utmSource: { type: String },
        utmMedium: { type: String },
        utmCampaign: { type: String },
        firstSeen: { type: Date, default: Date.now },
        lastSeen: { type: Date, default: Date.now },
        visitCount: { type: Number, default: 1 },
        consentedAt: { type: Date },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
    delete mongoose.models.Visitor;
}

const Visitor: Model<IVisitor> =
    mongoose.models.Visitor || mongoose.model<IVisitor>("Visitor", VisitorSchema);

export default Visitor;
