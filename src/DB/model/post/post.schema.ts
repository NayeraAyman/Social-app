import { model, Schema } from "mongoose";
import { IPost } from "../../../utils";
import { reactionSchema } from "../common/reaction.schema";

export const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      // required: function () {
      //   if (this.attachments.length > 0) return false;
      //   return true;
      // },
      trim: true,
    },
    reactions: [reactionSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});
