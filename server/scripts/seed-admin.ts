import "dotenv/config";
import bcrypt from "bcryptjs";
import { ensureConnected } from "../../server/db/sequelize";
import User from "../models/User.model"; // adjust path if needed

async function seedSystemAdmin() {
  const sequelize = await ensureConnected();

  const email = "admin@roarbyte.test";
  const password = "TempAdmin@123"; // TEMP — change later

  // Check if admin already exists
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log("⚠️ System admin already exists:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await User.create({
    email,
    passwordHash, // or `password` if you hash in hooks
    firstName: "System",
    lastName: "Admin",
    role: "system_admin",
    isActive: true,
    emailVerified: true, // optional but recommended
  });

  console.log("✅ System admin created");
  console.log("   Email:", email);
  console.log("   Password:", password);
  console.log("   ID:", admin.id);
}

seedSystemAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Failed to seed system admin", err);
    process.exit(1);
  });
