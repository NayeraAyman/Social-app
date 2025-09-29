import { model, Schema } from "mongoose";
import { IPost, IReaction, REACTION } from "../../../utils";

export const reactionSchema = new Schema<IReaction>(
  {
    reaction: {
      type: Number,
      enum: REACTION,
      default: REACTION.like,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

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
  }
);
