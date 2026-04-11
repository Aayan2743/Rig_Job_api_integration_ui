import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function IndustryManager({ setIndustryCount }) {
  const [industries, setIndustries] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');

  const [showDrawer, setShowDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
 const [form, setForm] = useState({
  name: '',
  image: null
});

const [preview, setPreview] = useState(null);

  // ✅ Fetch Industries
  const fetchIndustries = async (page = 1) => {
    try {
      const res = await api.get('/admin/industries', {
        params: { search, page }
      });

      setIndustries(res.data.data);
      setPagination(res.data.pagination);
       setIndustryCount(res.data.pagination.total);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIndustries(1);
  }, [search]);

  // ✅ Drawer controls
  const openDrawer = (item = null) => {
    setEditItem(item);
   setForm({
  name: item?.name || '',
  image: null
});

setPreview(item?.image || null);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setEditItem(null);
     setPreview(null);
  };

  // ✅ Save (Add / Edit)
  const handleSavessss = async () => {
    try {
      if (!form.name.trim()) return alert('Industry name required');

      if (editItem) {
        await api.post(`/admin/industries/${editItem.id}`, form);
      } else {
        await api.post(`/admin/industries`, form);
      }

      fetchIndustries();
      closeDrawer();

    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
  try {
    if (!form.name.trim()) return alert('Industry name required');

    const formData = new FormData();
    formData.append("name", form.name);

    if (form.image) {
      formData.append("image", form.image); // ✅ important
    }

    if (editItem) {
      await api.post(`/admin/industries/${editItem.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    } else {
      await api.post(`/admin/industries`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    fetchIndustries();
    closeDrawer();

  } catch (err) {
    console.error(err);
  }
};

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this industry?')) return;

    await api.delete(`/admin/industries/${id}`);
    fetchIndustries();
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-foreground">Industry / Sector</h3>
          <p className="text-xs text-muted-foreground">
            Manage industries for company registration
          </p>
        </div>

        <button
          onClick={() => openDrawer()}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
        >
          + Add Industry 
        </button>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search industries..."
        className="w-full px-4 py-2 border rounded-lg text-sm"
      />

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {industries.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground text-center">
            No industries found
          </p>
        ) : (
          <div className="divide-y">
            {industries.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center px-4 py-3 hover:bg-muted/10"
              >
               <div className="flex items-center gap-3">
  {item.image && (
    <img
      src={item.image}
      alt='Images'
      className="w-10 h-10 rounded object-cover"
    />
  )}
  <p className="text-sm font-medium">{item.name}</p>
</div>

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
            onClick={() => fetchIndustries(i + 1)}
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
              {editItem ? 'Edit Industry' : 'Add Industry'}
            </h2>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Enter industry name"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />

            <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    setForm({ ...form, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }}
  className="w-full mb-3"
/>


{preview && (
  <img
    src={preview}
    className="w-16 h-16 rounded object-cover mb-3 border"
  />
)}

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