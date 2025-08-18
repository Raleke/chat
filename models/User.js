const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email']
    },
 
    passwordHash: { type: String, required: true },

    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    avatarUrl: { type: String },

    passwordChangedAt: { type: Date },


    resetPasswordTokenHash: { type: String, index: true, default: null },
    resetPasswordExpiresAt: { type: Date, default: null }
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
      }
    }
  }
);

/**
 * Optional virtual to allow setting `password` directly on the model.
 * If you already hash in the controller, you can ignore this.
 */
UserSchema.virtual('password')
  .set(function setPasswordVirtual(plain) {
    this._password = plain;
  });

/**
 * Pre-save: if a virtual password was provided, hash it.
 */
UserSchema.pre('save', async function hashPasswordIfProvided(next) {
  try {
    if (this._password) {
      this.passwordHash = await bcrypt.hash(this._password, 10);
      this.passwordChangedAt = new Date();
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Compare a plaintext password to the stored hash.
 */
UserSchema.methods.comparePassword = async function comparePassword(plain) {
  return bcrypt.compare(plain || '', this.passwordHash);
};

/**
 * Programmatically set a new password (hash + mark changed).
 */
UserSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(String(plain), 10);
  this.passwordChangedAt = new Date();
};

/**
 * Create a password reset token:
 *  - Generates a random token (returned in plain form to email to the user)
 *  - Stores only the SHA-256 hash in DB
 *  - Sets an expiry (default 15 minutes)
 */
UserSchema.methods.createPasswordResetToken = function createPasswordResetToken(
  ttlMs = 15 * 60 * 1000
) {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  this.resetPasswordTokenHash = tokenHash;
  this.resetPasswordExpiresAt = new Date(Date.now() + ttlMs);

  return token; // <- send this plain token via email
};

/**
 * Clear the password reset token (after successful reset or manual revoke).
 */
UserSchema.methods.clearPasswordResetToken = function clearPasswordResetToken() {
  this.resetPasswordTokenHash = null;
  this.resetPasswordExpiresAt = null;
};

/**
 * Static helper: find a user by a provided reset token (plain),
 * ensuring it matches and hasn't expired.
 */
UserSchema.statics.findByValidResetToken = async function findByValidResetToken(
  token
) {
  if (!token) return null;
  const tokenHash = crypto.createHash('sha256').update(String(token)).digest('hex');
  const now = new Date();
  return this.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: now }
  });
};

module.exports = model('User', UserSchema);