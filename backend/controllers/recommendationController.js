const db = require("../config/db");

// 🪴 Get recommended products based on user’s past purchases
exports.getRecommendations = (req, res) => {
  const userId = req.user.id;

  // Step 1: Get the categories user has bought most often
  const query = `
    SELECT p.category, COUNT(*) AS count
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON p.id = oi.product_id
    WHERE o.user_id = ?
    GROUP BY p.category
    ORDER BY count DESC
    LIMIT 1
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error fetching recommendations" });

    if (results.length === 0) {
      // If user has no orders, show random products
      const fallbackQuery = "SELECT * FROM products ORDER BY RAND() LIMIT 4";
      db.query(fallbackQuery, (err2, fallback) => {
        if (err2) return res.status(500).json({ error: "Error fetching fallback products" });
        return res.json({ category: null, recommendations: fallback });
      });
    } else {
      const favCategory = results[0].category;

      // Step 2: Fetch other products from that category
      const productQuery = "SELECT * FROM products WHERE category = ? ORDER BY RAND() LIMIT 4";
      db.query(productQuery, [favCategory], (err3, products) => {
        if (err3) return res.status(500).json({ error: "Error fetching category-based products" });
        return res.json({ category: favCategory, recommendations: products });
      });
    }
  });
};
