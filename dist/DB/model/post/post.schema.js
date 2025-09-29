"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = exports.reactionSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
exports.reactionSchema = new mongoose_1.Schema({
    reaction: {
        type: Number,
        enum: utils_1.REACTION,
        default: utils_1.REACTION.like,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
exports.postSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    reactions: [exports.reactionSchema],
}, {
    timestamps: true,
});
