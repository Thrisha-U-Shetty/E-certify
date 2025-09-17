import mongoose from "mongoose";

// Counter schema for auto-increment
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model("Counter", counterSchema);

const requestSchema = new mongoose.Schema({
  requestNumber: { type: Number, unique: true }, // incremental request number
  name: { type: String, required: true },
  usn: { type: String, required: true },
  courseTitle: { type: String, required: true },
  type: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  signatory: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending | approved
});

// Auto-increment requestNumber before saving
requestSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "requestNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.requestNumber = counter.seq;
  }
  next();
});

const Request = mongoose.model("Request", requestSchema);

export default Request;
