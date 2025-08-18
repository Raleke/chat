const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email'],
    },
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    avatarUrl: { type: String },

    passwordChangedAt: { type: Date },

    resetPasswordTokenHash: { type: String, index: true, default: null },
    resetPasswordExpiresAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.resetPasswordTokenHash;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);


UserSchema.virtual('password').set(function (plainPassword) {
  this._password = plainPassword;
});


UserSchema.pre('save', async function (next) {
  if (this._password) {
    this.passwordHash = await bcrypt.hash(this._password, 10);
    this.passwordChangedAt = new Date();
  }
  next();
});


UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = model('User', UserSchema);