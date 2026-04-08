import { useState, useEffect } from "react";
import api from "../../utils/api";
import { showSuccess, showError, showConfirm, showLoading, closeAlert } from "../../utils/alert";

export default function EducationManager() {

  const [educations, setEducations] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);

  // 🚀 FETCH DATA
  const fetchEducations = async (pageNo = 1) => {
    try {
      const res = await api.get("/admin/education-details/educations", {
        params: { search, page: pageNo },
      });

      setEducations(res.data.data.data);
      setPagination(res.data.data);

    } catch (err) {
      showError("Failed to load data");
    }
  };

  useEffect(() => {
    fetchEducations(page);
  }, [search, page]);

  // 🚀 OPEN DRAWER
  const openDrawer = (item = null) => {
    if (item) {
      setForm({ name: item.name });
      setEditId(item.id);
    } else {
      setForm({ name: "" });
      setEditId(null);
    }
    setShowDrawer(true);
  };

  // 🚀 SAVE
  const handleSave = async () => {
    try {
      showLoading();

      if (editId) {
        await api.put(`/admin/education-details/educations/${editId}`, form);
        showSuccess("Updated successfully");
      } else {
        await api.post(`/admin/education-details/educations`, form);
        showSuccess("Added successfully");
      }

      closeAlert();
      setShowDrawer(false);
      fetchEducations();

    } catch (err) {
      closeAlert();

      if (err.response?.status === 422) {
        showError(err.response.data.errors);
      } else {
        showError("Something went wrong");
      }
    }
  };

  // 🚀 DELETE
  const handleDelete = async (id) => {
    const confirm = await showConfirm("Delete this education?");
    if (!confirm) return;

    try {
      showLoading();

      await api.delete(`/admin/education-details/educations/${id}`);

      closeAlert();
      showSuccess("Deleted successfully");

      fetchEducations();

    } catch {
      closeAlert();
      showError("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Education Master</h2>

        <button
          onClick={() => openDrawer()}
          className="bg-secondary text-white px-4 py-2 rounded-xl text-sm"
        >
          + Add
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search education..."
        className="w-full border px-4 py-2 rounded-xl text-sm"
      />

      {/* TABLE */}
      <div className="overflow-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Name</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {educations.map((item) => (
              <tr key={item.id} className="border-b">

                <td className="py-3">{item.name}</td>

                <td className="flex gap-3 py-3">
                  <button
                    onClick={() => openDrawer(item)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 font-semibold"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}

            {educations.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-muted-foreground">
                  No data found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: pagination.last_page || 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-secondary text-white"
                : "border"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* DRAWER */}
      {showDrawer && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

          <div className="w-[400px] bg-white h-full p-6 shadow-xl">

            <h2 className="font-bold mb-4">
              {editId ? "Edit" : "Add"} Education
            </h2>

            <input
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="Enter education name"
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-secondary text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setShowDrawer(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}