const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Lưu key tạm thời trong bộ nhớ
const keys = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Tạo Key
app.post("/api/get-key", (req, res) => {
  const key = "CUTE-" + crypto.randomBytes(12).toString("hex").toUpperCase();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  keys.set(key, expiresAt);

  res.json({
    success: true,
    key,
    expiresAt
  });
});

// Kiểm tra Key
app.post("/api/check-key", (req, res) => {
  const { key } = req.body;

  if (!key || !keys.has(key)) {
    return res.json({
      success: false,
      message: "Key không hợp lệ"
    });
  }

  const expiresAt = keys.get(key);

  if (Date.now() > expiresAt) {
    keys.delete(key);

    return res.json({
      success: false,
      message: "Key đã hết hạn"
    });
  }

  res.json({
    success: true,
    message: "Key hợp lệ",
    expiresAt
  });
});

// Chạy website
app.listen(PORT, "0.0.0.0", () => {
  console.log(`ChatGPT Cute đang chạy tại port ${PORT}`);
});
