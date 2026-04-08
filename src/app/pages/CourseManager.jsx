import { useState, useEffect } from "react";
import api from "../../utils/api";

import {
  showSuccess,
  showError,
  showConfirm,
  showLoading,
  closeAlert,
} from "../../utils/alert";

export default function CourseManager() {

  const [courses, setCourses] = useState([]);
  const [educations, setEducations] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState({
    name: "",
    education_id: "",
  });
  const [editId, setEditId] = useState(null);

  // 🚀 FETCH EDUCATIONS (dropdown)
  const fetchEducations = async () => {
    try {
      const res = await api.get("/admin/education-details/educations");
      setEducations(res.data.data.data || res.data.data);
    } catch {
      showError("Failed to load educations");
    }
  };

  // 🚀 FETCH COURSES
  const fetchCourses = async (pageNo = 1) => {
    try {
      const res = await api.get("/admin/education-details/courses", {
        params: { search, page: pageNo },
      });

      setCourses(res.data.data.data);
      setPagination(res.data.data);

    } catch {
      showError("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses(page);
  }, [search, page]);

  useEffect(() => {
    fetchEducations();
  }, []);

  // 🚀 OPEN DRAWER
  const openDrawer = (item = null) => {
    if (item) {
      setForm({
        name: item.name,
        education_id: item.education_id,
      });
      setEditId(item.id);
    } else {
      setForm({ name: "", education_id: "" });
      setEditId(null);
    }
    setShowDrawer(true);
  };

  // 🚀 SAVE

  const handleSave = async () => {
  try {
    showLoading();

    if (editId) {
      await api.post(`/admin/education-details/courses/${editId}`, form);
    } else {
      await api.post(`/admin/education-details/courses`, form);
    }

    closeAlert(); // ✅ CLOSE FIRST

    showSuccess(editId ? "Updated successfully" : "Added successfully");

    setShowDrawer(false);
    fetchCourses();

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
  const confirm = await showConfirm("Delete this course?");
  if (!confirm) return;

  try {
    showLoading();

    await api.delete(`/admin/education-details/courses/${id}`);

    closeAlert(); // ✅ FIRST

    showSuccess("Deleted successfully");

    fetchCourses();

  } catch {
    closeAlert();
    showError("Delete failed");
  }
};

  return (
    <div className="bg-white rounded-2xl border p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Course Master</h2>

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
        placeholder="Search course..."
        className="w-full border px-4 py-2 rounded-xl text-sm"
      />

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Course</th>
            <th>Education</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((item) => (
            <tr key={item.id} className="border-b">

              <td className="py-3">{item.name}</td>
              <td>{item.education?.name}</td>

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
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex gap-2">
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
        <div className="fixed inset-0 bg-black/40 flex justify-end">

          <div className="w-[400px] bg-white p-6">

            <h2 className="font-bold mb-4">
              {editId ? "Edit" : "Add"} Course
            </h2>

            {/* EDUCATION DROPDOWN */}
            <select
              value={form.education_id}
              onChange={(e) =>
                setForm({ ...form, education_id: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="">Select Education</option>

              {educations.map((edu) => (
                <option key={edu.id} value={edu.id}>
                  {edu.name}
                </option>
              ))}
            </select>

            {/* COURSE NAME */}
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Enter course name"
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