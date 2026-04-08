import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { showSuccess, showError, showConfirm, showLoading, closeAlert } from '../../utils/alert';

export default function CategoryManager({ setCategoryCount }) {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');

  const [showDrawer, setShowDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '' });

  // ✅ Fetch Categories
  const fetchCategories = async (page = 1) => {
    try {
      const res = await api.get('/admin/categories', {
        params: { search, page }
      });

      setCategories(res.data.data);
      setPagination(res.data.pagination);
        setCategoryCount(res.data.pagination.total);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, [search]);

  // ✅ Drawer controls
  const openDrawer = (item = null) => {
    setEditItem(item);
    setForm({ name: item?.name || '' });
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setEditItem(null);
  };

  // ✅ Save (Add / Edit)
const handleSave = async () => {
  try {
    if (!form.name.trim()) {
      showError("Name is required");
      return;
    }

    showLoading(); // 🔥 loader

    if (editItem) {
      await api.post(`/admin/categories/${editItem.id}`, form);
    } else {
      await api.post(`/admin/categories`, form);
    }

    closeAlert(); // ✅ close loader

    showSuccess(
      editItem
        ? "Category updated successfully"
        : "Category added successfully"
    );
      await fetchCategories(1);

    
    closeDrawer();

  } catch (err) {
    closeAlert(); // ❗ always close loader

    if (err.response?.status === 422) {
      showError(err.response.data.errors); // ✅ your helper handles array
    } else {
      showError(err.response?.data?.message || "Something went wrong");
    }
  }
};

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    await api.delete(`/admin/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-foreground">Job Categories</h3>
          <p className="text-xs text-muted-foreground">
            Manage categories for job posting
          </p>
        </div>

        <button
          onClick={() => openDrawer()}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
        >
          + Add Category
        </button>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories..."
        className="w-full px-4 py-2 border rounded-lg text-sm"
      />

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground text-center">
            No categories found
          </p>
        ) : (
          <div className="divide-y">
            {categories.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-4 py-3 hover:bg-muted/10"
              >
                <p className="text-sm font-medium">{item.name}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => openDrawer(item)}
                    className="text-blue-600 text-xs font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex gap-2 justify-center">
        {[...Array(pagination.last_page || 1)].map((_, i) => (
          <button
            key={i}
            onClick={() => fetchCategories(i + 1)}
            className={`px-3 py-1 rounded text-sm ${
              pagination.current_page === i + 1
                ? 'bg-secondary text-white'
                : 'bg-gray-100'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="w-[400px] bg-white h-full p-6 shadow-xl">

            <h2 className="text-lg font-bold mb-4">
              {editItem ? 'Edit Category' : 'Add Category'}
            </h2>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Enter category name"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-secondary text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={closeDrawer}
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