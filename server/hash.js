import bcrypt from "bcrypt";

const password = "12"; // test password
const hash = await bcrypt.hash(password, 10);

console.log("Hashed password:", hash);


