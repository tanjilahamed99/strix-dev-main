import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageView extends Document {
    visitorId: string;
    path: string;
    viewedAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
    {
        visitorId: { type: String, required: true, index: true },
        path: { type: String, required: true },
        viewedAt: { type: Date, default: Date.now, index: true },
    },
    { timestamps: false }
);

const PageView: Model<IPageView> =
    mongoose.models.PageView || mongoose.model<IPageView>("PageView", PageViewSchema);

export default PageView;
