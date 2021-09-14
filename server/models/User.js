const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

//list all properties might have
const userSchema = new Schema({
	googleId: String,
});
//Create a new collection named users
mongoose.model('users', userSchema);
