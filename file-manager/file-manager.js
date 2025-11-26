const fs = require("fs");
const path = require("path");


const filePath = path.join(__dirname, "product.json");


function readProducts() {
    try {
        const data = fs.readFileSync(filePath, "utf8");

        if (!data || data.trim() === "") {
            return [];
        }

        return JSON.parse(data);
    } catch (err) {
        console.log("Faylni o‘qishda xatolik:", err);
        return [];
    }
}


function writeProducts(products) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    } catch (err) {
        console.log("Faylni yozishda xatolik:", err);
    }
}


module.exports = {
    readProducts,
    writeProducts
};
