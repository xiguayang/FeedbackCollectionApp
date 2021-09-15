const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

//list all properties might have
const userSchema = new Schema({
	googleId: String,
	credits: { type: Number, default: 0 },
});
//Create a new collection named users
mongoose.model('users', userSchema);
