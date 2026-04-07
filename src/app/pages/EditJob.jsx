import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  // fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/employeer/jobs/${id}`);

        if (res.data.success) {
          setForm(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/employeer/jobs/${id}`, form);

      if (res.data.success) {
        alert("Job updated successfully");
        navigate("/company/jobs");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Job Title"
        className="border p-2 w-full"
      />

      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="border p-2 w-full"
      />

      <input
        name="type"
        value={form.type}
        onChange={handleChange}
        placeholder="Job Type"
        className="border p-2 w-full"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Update Job
      </button>
    </form>
  );
}