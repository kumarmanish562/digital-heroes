import bcrypt from "bcryptjs";
import { connectDatabase, disconnectDatabase } from "../src/config/db.js";
import { User } from "../src/models/User.js";
import { Charity } from "../src/models/Charity.js";

await connectDatabase();

const adminEmail = "admin@digitalheroes.local";
const adminPassword = "Admin@12345";
const existingAdmin = await User.findOne({ email: adminEmail });
if (!existingAdmin) {
  await User.create({ name: "Digital Heroes Admin", email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12), role: "ADMIN", active: true });
  console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
} else {
  console.log(`Admin already exists: ${adminEmail}`);
}

const charities = [
  { name: "Fairway Futures", description: "Golf access, youth coaching and community sports programs.", website: "https://example.org/fairway-futures", active: true },
  { name: "Green Horizons", description: "Projects that protect green spaces and local environments.", website: "https://example.org/green-horizons", active: true },
  { name: "The Caddie Fund", description: "Education and opportunity programs for golf communities.", website: "https://example.org/caddie-fund", active: true }
];
for (const charity of charities) await Charity.updateOne({ name: charity.name }, { $setOnInsert: charity }, { upsert: true });
console.log("Charities seeded.");
await disconnectDatabase();
