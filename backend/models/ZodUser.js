const { z } = require("zod");

// User entity matching User mongoose model
const UserSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(["admin", "student"]),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// For JSDoc type hinting in JS (optional, gives you autocomplete in VS Code)
/**
 * @typedef {z.infer<typeof UserSchema>} User
 */

module.exports = { UserSchema };

