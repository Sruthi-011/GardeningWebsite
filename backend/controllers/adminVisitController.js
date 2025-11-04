const db = require("../config/db");

// ✅ Fetch all visit bookings
exports.getAllVisits = (req, res) => {
  const query = `
    SELECT vb.id, vb.user_id, u.name AS user_name, u.email,
           vb.visit_date, vb.time_slot, vb.status, vb.created_at
    FROM visit_bookings vb
    JOIN users u ON vb.user_id = u.id
    ORDER BY vb.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching visits:", err);
      return res.status(500).json({ error: "Server error fetching visits" });
    }
    res.json(results);
  });
};

// ✅ Update visit status (Approve / Deny)
exports.updateVisitStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Denied"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const query = "UPDATE visit_bookings SET status = ? WHERE id = ?";

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error("Error updating visit status:", err);
      return res.status(500).json({ error: "Server error updating status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Visit not found" });
    }

    res.json({ message: `Visit ${status} successfully.` });
  });
};
