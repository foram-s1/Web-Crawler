const { Schema, model } = require("mongoose");

const QuesSchema = new Schema({
    url: {
        type: String,
        // required: true,
    },
    vote: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    view: {
        type: String,
        required: true,
    }
});

module.exports = Ques = model("Ques", QuesSchema);