import { Schema, model } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";

const BrewInstructionSchema = Schema(
  {
    title: String,
    requirements: [String],
    steps: [String],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

BrewInstructionSchema.plugin(mongoosePlugin);

const BrewInstruction = model("BrewInstruction", BrewInstructionSchema);

export default BrewInstruction;
