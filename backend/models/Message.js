const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    message: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;