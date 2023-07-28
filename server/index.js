const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const problemRoutes = require("./Routes/problemRoutes");
const stripe = require("stripe")(
  "sk_test_51NGyPnEMVZmfmeX3pN6VkNqhUXaxsk9Rki3LhSbC0wiL1aAneCIhqw4s2UJi5Y41hqvc4WwS9YxOnDwFISent3f000VtbIgpfN"
);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "new-password",
  database: "PEETCODE",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Connected to the database!");
});

app.get("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          unit_amount: 350000,
          product_data: {
            name: "Premium Subscription",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3002/problems?success=true",
    cancel_url: "http://localhost:3002/problems?success=false",
  });
  res.json({ id: session.url });
});

app.use("/", userRoutes);
app.use("/", problemRoutes);

app.listen(4700, () => {
  console.log("Connected to server.");
});
