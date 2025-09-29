const bcrypt = require("bcrypt");

(async () => {
  const password = "admin123"; // 👈 la contraseña en texto plano
  const hash = await bcrypt.hash(password, 10);
  console.log("Hash generado:", hash);
})();
