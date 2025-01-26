const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"

    },
    status : {
        type : String,
        enum : {
            values : ["like", "pass", "accepted", "rejected"],
            message : "{VALUE} is not a valid status"
        }
    }
}, { timestamps: true });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {ConnectionRequest};