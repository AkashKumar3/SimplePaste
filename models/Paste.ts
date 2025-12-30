import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaste extends Document {
  content: string;
  expiresAt: Date | null;
  maxViews: number | null;
  views: number;
  createdAt: Date;
}

const PasteSchema = new Schema<IPaste>({
  content: { type: String, required: true },
  expiresAt: { type: Date, default: null },
  maxViews: { type: Number, default: null },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Paste: Model<IPaste> =
  mongoose.models.Paste || mongoose.model<IPaste>("Paste", PasteSchema);

export default Paste;
