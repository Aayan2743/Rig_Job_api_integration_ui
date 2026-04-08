import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  showSuccess,
  showError,
  showConfirm,
  showLoading,
  closeAlert,
} from "../../utils/alert";

export default function SpecializationManager() {

  const [specializations, setSpecializations] = useState([]);
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({
    name: "",
    course_id: "",
  });
  const [editId, setEditId] = useState(null);

  // 🚀 FETCH COURSES (dropdown)
  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/education-details/courses");
      setCourses(res.data.data.data || res.data.data);
    } catch {
      showError("Failed to load courses");
    }
  };

  // 🚀 FETCH SPECIALIZATIONS
  const fetchSpecializations = async (pageNo = 1) => {
    try {
      const res = await api.get("/admin/education-details/specializations", {
        params: { search, page: pageNo },
      });

      setSpecializations(res.data.data.data);
      setPagination(res.data.data);

    } catch {
      showError("Failed to load specializations");
    }
  };

  useEffect(() => {
    fetchSpecializations(page);
  }, [search, page]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🚀 OPEN DRAWER
  const openDrawer = (item = null) => {
    if (item) {
      setForm({
        name: item.name,
        course_id: item.course_id,
      });
      setEditId(item.id);
    } else {
      setForm({ name: "", course_id: "" });
      setEditId(null);
    }
    setShowDrawer(true);
  };

  // 🚀 SAVE
  const handleSave = async () => {
    if (!form.name || !form.course_id) {
      return showError("All fields are required");
    }

    try {
      showLoading();

      if (editId) {
        await api.post(`/admin/education-details/specializations/${editId}`, form);
      } else {
        await api.post(`/admin/education-details/specializations`, form);
      }

      closeAlert();
      showSuccess(editId ? "Updated successfully" : "Added successfully");

      setShowDrawer(false);
      fetchSpecializations();

    } catch (err) {
      closeAlert();

      if (err.response?.status === 422) {
        showError(err.response.data.errors);
      } else {
        showError(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  // 🚀 DELETE
  const handleDelete = async (id) => {
    const confirm = await showConfirm("Delete this specialization?");
    if (!confirm) return;

    try {
      showLoading();

      await api.delete(`/admin/education-details/specializations/${id}`);

      closeAlert();
      showSuccess("Deleted successfully");

      fetchSpecializations();

    } catch {
      closeAlert();
      showError("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Specialization Master</h2>

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
        placeholder="Search specialization..."
        className="w-full border px-4 py-2 rounded-xl text-sm"
      />

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Specialization</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {specializations.map((item) => (
            <tr key={item.id} className="border-b">

              <td className="py-3">{item.name}</td>
              <td>{item.course?.name}</td>

              <td className="flex gap-3 py-3">
                <button
                  onClick={() => openDrawer(item)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}

          {specializations.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-4 text-muted-foreground">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: pagination.last_page || 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-secondary text-white" : "border"
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
              {editId ? "Edit" : "Add"} Specialization
            </h2>

            {/* COURSE DROPDOWN */}
            <select
              value={form.course_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  course_id: Number(e.target.value)
                })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="">Select Course</option>

              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* NAME */}
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Enter specialization"
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