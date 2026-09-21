import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdmin extends Document {
    username: string;
    password: string; // Plain text unhashed password
    role?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
    {
        username: {
            type: String,
            default: "admin",
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "superadmin",
        },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
    delete mongoose.models.Admin;
}

const Admin: Model<IAdmin> =
    mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
