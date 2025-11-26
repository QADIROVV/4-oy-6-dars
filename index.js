//   LOgin
  if (req.method === "POST" && req.url === "/login") {
    req.on("data", async (chunk) => {
      const data = JSON.parse(chunk);
      const { email, password } = data;

      if (!email || !password) {
        res.writeHead(400, option);
        return res.end(
          JSON.stringify({ message: "email and password are required" })
        );
      }

      const user = read_file("auth.json");
      const foundedUser = user.find((item) => item.email === email);

      if (!foundedUser) {
        res.writeHead(401, option);
       return res.end(
          JSON.stringify({
            message: "User not found",
          })
        );
      }

      const decode = await bcrypt.compare(password, foundedUser.password);

      if (decode) {
        const payload = { id: foundedUser.id, username: foundedUser.username };
        const acces_token = jwt.sign(payload, "salom", { expiresIn: "15m" });
        res.writeHead(200, option);
        res.end(
          JSON.stringify({
            message: "Success",
            acces_token,
          })
        );
      } else {
        res.writeHead(401, option);
        res.end(
          JSON.stringify({
            message: "Wrong password"
          })
        );
      }
    });
  }



const express = require("express");
const app = express();


app.use(express.json());


const { readProducts, writeProducts } = require("./file-manager");


app.get("/products", (req, res) => {
    console.log("\n--- Dorilar ro‘yxati ---");

    const products = readProducts();

    if (products.length === 0) {
        return res.json({ message: "Dorilar mavjud emas" });
    }

    res.json(products);
});


app.post("/products", (req, res) => {
    console.log("\n--- Yangi dori qo‘shish ---");

    const { name, price, count } = req.body;

    const products = readProducts();

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        count
    };

    products.push(newProduct);
    writeProducts(products);

    res.json({
        message: "Dori muvaffaqiyatli qo‘shildi!",
        product: newProduct
    });
});


app.delete("/products/:id", (req, res) => {
    console.log("\n--- Dori o‘chirish ---");

    const id = parseInt(req.params.id);
    let products = readProducts();

    const exists = products.some(p => p.id === id);

    if (!exists) {
        return res.json({ message: "Bunday ID mavjud emas" });
    }

    products = products.filter(p => p.id !== id);
    writeProducts(products);

    res.json({ message: `ID ${id} bo‘lgan dori o‘chirildi` });
});


app.put("/products/:id", (req, res) => {
    console.log("\n--- Dori yangilash ---");

    const id = parseInt(req.params.id);
    const newData = req.body;

    const products = readProducts();

    const exists = products.some(p => p.id === id);
    if (!exists) {
        return res.json({ message: "Bunday ID mavjud emas" });
    }

    const updated = products.map(p => {
        if (p.id === id) {
            return { ...p, ...newData };
        }
        return p;
    });

    writeProducts(updated);

    res.json({
        message: `ID ${id} bo‘lgan dori muvaffaqiyatli yangilandi`,
        updatedProduct: newData
    });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
