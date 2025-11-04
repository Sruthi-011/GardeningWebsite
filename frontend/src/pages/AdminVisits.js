import React, { useEffect, useState } from "react";

const AdminVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/admin/visits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch visits");
          return;
        }

        setVisits(data);
      } catch (err) {
        console.error("Error fetching visits:", err);
        setError("Server error fetching visits");
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5001/api/admin/visits/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      alert(data.message);
      setVisits((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status } : v))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Server error updating status");
    }
  };

  if (loading) return <p>Loading visits...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌱 Visit Booking Management</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Visit Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visits.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No visit bookings found</td>
            </tr>
          ) : (
            visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.id}</td>
                <td>{visit.user_name}</td>
                <td>{visit.email}</td>
                <td>{visit.visit_date}</td>
                <td>{visit.time_slot}</td>
                <td>{visit.status}</td>
                <td>
                  {visit.status === "Pending" ? (
                    <>
                      <button onClick={() => updateStatus(visit.id, "Approved")} style={{ color: "green", marginRight: "10px" }}>
                        Approve
                      </button>
                      <button onClick={() => updateStatus(visit.id, "Denied")} style={{ color: "red" }}>
                        Deny
                      </button>
                    </>
                  ) : (
                    <em>{visit.status}</em>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminVisits;
