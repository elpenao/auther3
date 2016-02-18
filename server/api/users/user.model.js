'use strict'; 

var mongoose = require('mongoose'),
	shortid = require('shortid'),
	_ = require('lodash');

var db = require('../../db');
var Story = require('../stories/story.model');
var crypto = require('crypto');
var _ = require('lodash');

var User = new mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate
	},
	name: String,
	photo: {
		type: String,
		default: '/images/default-photo.jpg'
	},
	phone: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	google: {
		id: String,
		name: String,
		email: String,
		token: String
	},
	twitter: {
		id: String,
		name: String,
		email: String,
		token: String
	},
	github: {
		id: String,
		name: String,
		email: String,
		token: String
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	salt: {
		type: String
	}
});

User.methods.getStories = function () {
	return Story.find({author: this._id}).exec();
};

// method to remove sensitive information from user objects before sending them out
User.methods.sanitize =  function () {
   return _.omit(this.toJSON(), ['password', 'salt']);
};

// generateSalt, encryptPassword and the pre 'save' and 'correctPassword' operations
// are all used for local authentication security.
var generateSalt = function () {
   return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
   var hash = crypto.createHash('sha1');
   hash.update(plainText);
   hash.update(salt);
   return hash.digest('hex');
};

User.pre('save', function (next) {
   if (this.isModified('password')) {
       this.salt = this.constructor.generateSalt();
       this.password = this.constructor.encryptPassword(this.password, this.salt);
   }
   next();
});

User.statics.generateSalt = generateSalt;
User.statics.encryptPassword = encryptPassword;

User.method('correctPassword', function (candidatePassword) {
   return encryptPassword(candidatePassword, this.salt) === this.password;
});

module.exports = db.model('User', User);