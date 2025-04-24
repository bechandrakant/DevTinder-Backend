const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    to: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: `invalid status: {VALUE}`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;

  if (connectionRequest.from.equals(connectionRequest.to)) {
    throw new Error("Cannot send request to self");
  }

  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
