import { useState, useRef,useEffect  } from 'react';
import { User, Briefcase, Edit3, Plus, X, Star, Award, Upload, FileText, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  showSuccess,
  showError,
  showConfirm,
  showLoading,
  closeAlert,
} from "../../utils/alert";
import api from '../../utils/api.js';


// const profileData = {
//   name: 'John Doe',
//   initials: 'JD',
//   title: 'Senior Drilling Engineer',
//   location: 'Houston, TX',
//   email: 'john.doe@email.com',
//   phone: '+1 (555) 012-3456',
//   website: 'johndoe.dev',
//   about: 'Experienced drilling engineer with 8+ years in deepwater and HPHT operations. Specialized in well planning, risk assessment, and drilling optimization for major energy companies across the Gulf of Mexico and North Sea.',
//   skills: ['Drilling Engineering', 'Well Planning', 'Deepwater Operations', 'Risk Assessment', 'HPHT Drilling', 'Leadership', 'Data Analysis'],
//   experience: [
//     { id: 1, company: 'Shell Energy', title: 'Senior Drilling Engineer', period: '2020 – Present', location: 'Houston, TX', description: 'Lead drilling operations for deepwater projects in the Gulf of Mexico. Managed teams of 15+ engineers and achieved 20% reduction in NPT.' },
//     { id: 2, company: 'BP Operations', title: 'Drilling Engineer', period: '2017 – 2020', location: 'Aberdeen, UK', description: 'Designed and executed drilling programs for North Sea assets. Expert in HPHT well operations and complex completion designs.' },
//   ],
//   education: [
//     { id: 1, school: 'University of Houston', degree: 'B.Sc. Petroleum Engineering', period: '2013 – 2017', gpa: '3.8 GPA' },
//   ],
//   certifications: ['IWCF Well Control – Subsea Level 3', 'OPITO BOSIET Offshore Safety', 'API Well Control Certified'],
// };

function EditableSection({ title, icon: Icon, children, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
        </div>
        <button onClick={onEdit} className="flex items-center space-x-1.5 text-sm text-primary hover:underline font-semibold">
          <Edit3 className="w-4 h-4" /><span>Edit</span>
        </button>
      </div>
      {children}
    </div>
  );
}

export function CandidateProfile() {

    const { user, logout } = useAuth();

    console.log('User from context:', user?.name || user?.email); // Debugging line

    const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD';  

  const [experiences, setExperiences] = useState([]);
  const [showExpDrawer, setShowExpDrawer] = useState(false);
  const [editExp, setEditExp] = useState(null);
  const [editingSkills, setEditingSkills] = useState(false);

const [certifications, setCertifications] = useState([
  
]);

const [showCertDrawer, setShowCertDrawer] = useState(false);


const [certInput, setCertInput] = useState('');
const [editIndex, setEditIndex] = useState(null);




const [editCertId, setEditCertId] = useState(null);



const [educations, setEducations] = useState([]);
const [courses, setCourses] = useState([]);
const [specializations, setSpecializations] = useState([]);





const openCertDrawer = (name = "", id = null) => {
  setCertInput(name);
  setEditCertId(id);
  setShowCertDrawer(true);
};





const [expForm, setExpForm] = useState({
  id: null,
  company: "",
  title: "",
  location: "",
  description: "",
    current: "yes", // default

  employment_type: "", // full-time / internship
  years: "",
  months: "",
  start_year: "",
  start_month: "",
  salary: "",
  notice_period: ""
});







const openExpDrawer = (item = null) => {
  if (item) {
    setExpForm({
      ...item
    });
  } else {
    setExpForm({
      id: null,
      current: "yes",
      company: "",
      title: "",
      location: "",
      description: "",
      years: "",
      months: "",
      start_year: "",
      start_month: "",
      end_year: "",
      end_month: "",
    });
  }

  setShowExpDrawer(true);
};










  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');


  const [usedskills, setusedSkills] = useState([]);
const [usedskillInput, setusedSkillInput] = useState('');


  const [about, setAbout] = useState([]);
  const [editingAbout, setEditingAbout] = useState(false);
  const [savedAbout, setSavedAbout] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);


  const aboutRef = useRef(null);
const skillsRef = useRef(null);
const expRef = useRef(null);
const eduRef = useRef(null);
const certRef = useRef(null);
const resumeRef = useRef(null);




const scrollToSection = (ref) => {
  ref.current?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};


const menu = [
  { label: "About", ref: aboutRef },
  { label: "Key skills", ref: skillsRef },
  { label: "Employment", ref: expRef },
  { label: "Education", ref: eduRef },
  { label: "Certifications", ref: certRef },
  { label: "Resume", ref: resumeRef }
];

  const handleFileSelect = (files) => {
    const valid = Array.from(files).filter(f => f.type === 'application/pdf');
    if (!valid.length) return;
    const newEntries = valid.map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: (f.size / 1024).toFixed(0) + ' KB',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }));
    setResumes(prev => [...prev, ...newEntries]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const removeResume = (id) => setResumes(prev => prev.filter(r => r.id !== id));

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(''); }
  };









const handleDeleteCert = async (id) => {
  const confirm = await showConfirm("Delete certification?");
  if (!confirm) return;

  try {
    await api.delete(`/candidate/certification/${id}`);
    showSuccess("Deleted");

    await fetchProfile();

  } catch {
    showError("Delete failed");
  }
};

  const handleAddSkill = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();

    const value = usedskillInput.trim();

    if (!value) return;

    // avoid duplicates
    if (usedskills.includes(value)) {
      setSkillInput('');
      return;
    }

    setusedSkills(prev => [...prev, value]);
    setusedSkillInput('');
  }
};

const removeUsedSkill = (skill) => {
  setusedSkills(prev => prev.filter(s => s !== skill));
};


const [educationList, setEducationList] = useState([]);
const [showEduDrawer, setShowEduDrawer] = useState(false);
const [editEduIndex, setEditEduIndex] = useState(null);
const [eduForm, setEduForm] = useState({
  education: '',
  course: '',
  specialization: '',
  institution: '',
  startYear: '',
  endYear: '',
  courseType: 'Full time'
});




const openEduDrawer = (data = null) => {
  if (data) {
    setEduForm({
      id: data.id,
      education: data.education_id,
      course: data.course_id,
      specialization: data.specialization_id,
      institution: data.institution,
      startYear: data.start_year,
      endYear: data.end_year,
      courseType: data.course_type,
      gradingSystem: data.grading_system || ""
    });
  } else {
    setEduForm({
      id: null,
      education: '',
      course: '',
      specialization: '',
      institution: '',
      startYear: '',
      endYear: '',
      courseType: 'Full time',
      gradingSystem: ''
    });
  }

  setShowEduDrawer(true);
};




const handleDeleteEducation = async (id) => {
  const confirm = await showConfirm("Delete education?");
  if (!confirm) return;

  try {
    await api.delete(`/candidate/education/${id}`);
    showSuccess("Deleted");

    await fetchProfile();

  } catch {
    showError("Delete failed");
  }
};



const fetchEducations = async () => {
  try {
    const res = await api.get("/admin/education-details/educations/all");

    console.log("Educations API response:", res.data); // Debugging line
    setEducations(res.data.data.data || res.data.data);
  } 
  catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    showError(message);
  }
};

const handleEducationChange = async (value) => {
  setEduForm({
    ...eduForm,
    education: value,
    course: "",
    specialization: "",
  });

  try {
    const res = await api.get("/admin/education-details/courses/all", {
      params: { education_id: value },
    });

    setCourses(res.data.data.data || res.data.data);
  } catch {
    showError("Failed to load courses");
  }
};


const handleCourseChange = async (value) => {
  setEduForm({
    ...eduForm,
    course: value,
    specialization: "",
  });

  try {
    const res = await api.get("/admin/education-details/specializations/all", {
      params: { course_id: value },
    });

    setSpecializations(res.data.data.data || res.data.data);
  } catch {
    showError("Failed to load specializations");
  }
};


const handleSaveAbout = async () => {
  try {
    showLoading();

    const res = await api.post("/candidate/about", {
      about: about,
    });

    closeAlert();
    showSuccess("About updated successfully");

    setEditingAbout(false);

  } catch (error) {
    closeAlert();

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    showError(message);
  }
};

useEffect(() => {
  fetchProfile();
  fetchEducations()
}, []);


const fetchProfile = async () => {
  try {
    showLoading();

    const res = await api.get("/candidate/profile");

    console.log("FULL RESPONSE:", res); // 🔥 DEBUG

    const data = res?.data?.data || {};

    console.log("PROFILE DATA:", data);

    // ✅ ABOUT
    setAbout(data.about || "");
    // setOriginalAbout(data.about || "");

    // ✅ SKILLS
    setSkills(
      Array.isArray(data.skills)
        ? data.skills.map(item => item.skill)
        : []
    );

    // ✅ EXPERIENCE
    setExperiences(data.experiences || []);

    setEducationList(data?.educations || []);

    setCertifications(data?.certifications || []);
    setResumes(data?.resumes || []);

    closeAlert();

  } catch (error) {
    console.log("PROFILE ERROR:", error); // 🔥 VERY IMPORTANT

    showError(
      error.response?.data?.message ||
      error.message ||
      "Failed to load profile"
    );
  }
};


const handleSaveSkills = async () => {
  try {
    showLoading();

    await api.post("/candidate/skills", {
      skills: skills,
    });

    closeAlert();
    showSuccess("Skills updated successfully");

    setEditingSkills(false);

  } catch (error) {
    closeAlert();

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    showError(message);
  }
};



const handleSaveExperience = async () => {
  if (!expForm.company || !expForm.title) {
    return showError("Company & Title required");
  }

  try {
    showLoading();

    // ✅ Convert to backend format
 


    const payload = {
  company: expForm.company,
  title: expForm.title,
  location: expForm.location,
  description: expForm.description,

  // ✅ REQUIRED
  current: expForm.current, // "yes" or "no"

  employment_type: expForm.employment_type,

  // ✅ EXACT FIELDS YOU WANT
  start_year: expForm.start_year,
  start_month: expForm.start_month,

  end_year:
    expForm.current === "no" ? expForm.end_year : null,

  end_month:
    expForm.current === "no" ? expForm.end_month : null,
};

    console.log("PAYLOAD:", payload); // 🔥 DEBUG

    if (expForm.id) {
      await api.put(`/candidate/experience/${expForm.id}`, payload);
    } else {
      await api.post(`/candidate/experience`, payload);
    }

    showSuccess("Saved successfully");
    setShowExpDrawer(false);
    await fetchProfile();
    // fetchExperiences();

  } catch (error) {
    console.log("ERROR:", error.response);
    showError(error.response?.data?.message || "Save failed");
  }
};




const handleSaveCert = async () => {
  if (!certInput.trim()) {
    return showError("Certification required");
  }

  try {
    showLoading();

    if (editCertId) {
      // ✅ UPDATE
      await api.put(`/candidate/certification/${editCertId}`, {
        name: certInput
      });
    } else {
      // ✅ CREATE
      await api.post(`/candidate/certification`, {
        name: certInput
      });
    }

    closeAlert();
    showSuccess("Saved successfully");

    setShowCertDrawer(false);
    setCertInput("");
    setEditCertId(null);

    await fetchProfile();

  } catch (error) {
    closeAlert();
    showError(error.response?.data?.message || "Save failed");
  }
};


const handleSaveEducation = async () => {
  if (!eduForm.course || !eduForm.institution) {
    return showError("Course & Institution required");
  }

  try {
    showLoading();

    const payload = {
      education_id: eduForm.education,
      course_id: eduForm.course,
      specialization_id: eduForm.specialization,
      institution: eduForm.institution,
      start_year: eduForm.startYear,
      end_year: eduForm.endYear,
      course_type: eduForm.courseType,
      grading_system: eduForm.gradingSystem
    };

    if (eduForm.id) {
      await api.put(`/candidate/education/${eduForm.id}`, payload);
    } else {
      await api.post(`/candidate/education`, payload);
    }

    closeAlert();
    showSuccess("Saved successfully");

    setShowEduDrawer(false);

    // ✅ REFRESH DATA
    await fetchProfile();

  } catch (error) {
    closeAlert();
    showError(error.response?.data?.message || "Save failed");
  }
};





const handleDeleteExperience = async (id) => {
  const confirm = await showConfirm("Delete this experience?");
  if (!confirm) return;

  try {
    await api.delete(`/candidate/experience/${id}`);
    showSuccess("Deleted");
     await fetchProfile();

    // fetchExperiences();

  } catch {
    showError("Delete failed");
  }
};


const handleUploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  try {
    await api.post("/candidate/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    showSuccess("Uploaded");
    fetchProfile();

  } catch (error) {
    showError(error.response?.data?.message);
  }
};




const handleDownloadResume = async (id) => {
  try {
    const res = await api.get(`/candidate/resume/${id}/download`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume");
    document.body.appendChild(link);
    link.click();

  } catch {
    showError("Download failed");
  }
};


const handleDeleteResume = async (id) => {
  const confirm = await showConfirm("Delete resume?");
  if (!confirm) return;

  try {
    await api.delete(`/candidate/resume/${id}`);
    showSuccess("Deleted");

    await fetchProfile();

  } catch {
    showError("Delete failed");
  }
};


const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ✅ VALIDATION (frontend)
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (!allowedTypes.includes(file.type)) {
    return showError("Only PDF or DOC/DOCX allowed");
  }

  const formData = new FormData();
  formData.append("resume", file);

  try {
    showLoading();

    await api.post("/candidate/resume", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    closeAlert();
    showSuccess("Resume uploaded");

    await fetchProfile();

  } catch (error) {
    closeAlert();
    showError(error.response?.data?.message || "Upload failed");
  }
};

return (
  <div className="max-w-7xl mx-auto p-4 space-y-4">

    {/* 🔥 HEADER */}
    <div className="bg-white rounded-2xl p-5 shadow-sm flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>

        <div>
          <h2 className="text-lg font-bold">{user.name}</h2>
          <p className="text-xs text-muted-foreground">Profile last updated - Today</p>

          <div className="flex flex-wrap gap-4 text-xs mt-2 text-muted-foreground">
            <span>📍 Location</span>
            <span>📞 9440161007</span>
            <span>✉️ {user.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-xl text-sm text-center">
        <p>Add job summary</p>
        <button className="mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs">
          Add details
        </button>
      </div>
    </div>

    {/* 🔥 MAIN GRID */}
    <div className="grid grid-cols-12 gap-4">

      {/* ✅ SIDEBAR */}
      <div className="col-span-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-sm sticky top-4">
          <h3 className="font-semibold mb-3">Quick links</h3>

           {menu.map((item, i) => (
      <div
        key={i}
        onClick={() => scrollToSection(item.ref)}
        className="flex justify-between py-2 border-b cursor-pointer hover:text-primary"
      >
        <span>{item.label}</span>
        <span className="text-blue-600 text-xs">View</span>
      </div>
    ))}

        </div>
      </div>

      {/* ✅ RIGHT CONTENT */}
      <div className="col-span-9 space-y-5">

        {/* 🔥 ABOUT */}
        <div ref={aboutRef}  className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">About Me</h3>
            <button onClick={() => setEditingAbout(!editingAbout)} className="text-blue-600 text-sm">Edit</button>
          </div>

          {editingAbout ? (
            <>
              <textarea value={about} onChange={e => setAbout(e.target.value)}
                className="w-full border rounded-xl p-3 text-sm mb-3" />

              <div className="flex gap-2">
                <button onClick={handleSaveAbout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Save
                </button>
                <button onClick={() => setEditingAbout(false)}
                  className="border px-4 py-2 rounded-lg text-sm">
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{about}</p>
          )}
        </div>

        <div ref={skillsRef} className="bg-white rounded-2xl p-5 shadow-sm">

  {/* HEADER */}
  <div className="flex justify-between mb-3">
    <h3 className="font-semibold">Key Skills </h3>

    <button
      onClick={() => setEditingSkills(!editingSkills)}
      className="text-blue-600 text-sm"
    >
      {editingSkills ? "Cancel" : "Edit"}
    </button>
  </div>

  {/* SKILLS LIST */}

<div className="flex flex-wrap gap-2 mb-4">
  {skills.map((skill, index) => {

    const skillName = typeof skill === "string" ? skill : skill.skill;

    return (
      <span
        key={index}
        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1"
      >
        {skillName}

        {editingSkills && (
          <button
            onClick={() =>
              setSkills(prev =>
                prev.filter((_, i) => i !== index)
              )
            }
          >
            ✕ 
          </button>
        )}
      </span>
    );
  })}
</div>

  {/* ➕ INPUT ONLY IN EDIT MODE */}
  {editingSkills && (
    <div className="flex gap-2 mb-3">
      <input
        value={skillInput}
        onChange={e => setSkillInput(e.target.value)}
        onKeyDown={e =>
          e.key === "Enter" &&
          (e.preventDefault(), addSkill())
        }
        className="flex-1 border rounded-xl px-3 py-2 text-sm"
        placeholder="Add skill"
      />

      <button
        onClick={addSkill}
        className="bg-blue-600 text-white px-4 rounded-lg"
      >
        +
      </button>
    </div>
  )}

  {/* 💾 SAVE BUTTON */}
  {editingSkills && (
    <button
      onClick={handleSaveSkills}
      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
    >
      Save Skills
    </button>
  )}
</div>

     
      

        {/* 🔥 EXPERIENCE */}
       

        <div ref={expRef} className="bg-white rounded-2xl p-5 shadow-sm">

  <div className="flex justify-between mb-3">
    <h3 className="font-semibold">Employment</h3>

    <button onClick={() => openExpDrawer()} className="text-blue-600 text-sm">
      Add
    </button>
  </div>

  {experiences.map(exp => (
    <div key={exp.id} className="border-b pb-3 mb-3">

      <div className="flex justify-between">
        <div>
          <h4 className="font-semibold">{exp.title}</h4>
          <p className="text-sm text-primary">{exp.company}</p>
        </div>

       <div className="text-xs text-muted-foreground text-right">

  <div>
    {exp.start_date && (
      (() => {
        const start = new Date(exp.start_date);
        const end = exp.is_current
          ? new Date()
          : exp.end_date
          ? new Date(exp.end_date)
          : null;

        if (!end) return "";

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();

        if (months < 0) {
          years--;
          months += 12;
        }

        return `${years} yrs ${months} mo`;
      })()
    )}
  </div>

  <div>{exp.job_type || "N/A"} </div>

</div>
      </div>

      <p className="text-sm mt-1">{exp.description}</p>

      <div className="flex gap-3 mt-2 text-xs">
        <button onClick={() => openExpDrawer(exp)} className="text-blue-600">
          Edit
        </button>

        <button onClick={() => handleDeleteExperience(exp.id)} className="text-red-500">
          Delete
        </button>
      </div>

    </div>
  ))}
</div>

        {/* 🔥 EDUCATION */}
     <div ref={eduRef} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">

  {/* HEADER */}
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold text-foreground">Education</h3>

    <button
      onClick={() => openEduDrawer()}
      className="text-sm font-semibold text-secondary"
    >
      + Add
    </button>
  </div>

  {/* EMPTY STATE */}
  {educationList.length === 0 && (
    <p className="text-sm text-muted-foreground">
      No education added yet. Click “Add” to include your education.
    </p>
  )}

  {/* LIST */}
  <div className="space-y-4">
    {educationList.map((edu) => (
      <div
        key={edu.id}
        className="flex justify-between items-start border-b last:border-none pb-4"
      >

        {/* LEFT */}
        <div>

          {/* COURSE */}
         <h4 className="font-semibold">
  {edu.course_name}
  {edu.specialization_name && ` (${edu.specialization_name})`}
</h4>

<p className="text-sm text-muted-foreground">
  {edu.institution}
</p>

<p className="text-xs text-muted-foreground">
  {edu.start_year} - {edu.end_year || "Present"} • {edu.course_type}
</p>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 text-xs mt-1">
          <button
            onClick={() => openEduDrawer(edu)}
            className="text-blue-600 font-semibold"
          >
            Edit
          </button>

          <button
            onClick={() => handleDeleteEducation(edu.id)}
            className="text-red-500 font-semibold"
          >
            Delete
          </button>
        </div>

      </div>
    ))}
  </div>

    </div>

        {/* 🔥 CERTIFICATIONS */}
        <div ref={certRef} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Certifications</h3>
            <button onClick={() => openCertDrawer()} className="text-blue-600 text-sm">Add</button>
          </div>

          {/* {certifications.map((cert, i) => (
            <div key={i} className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded mb-2">
              <span>{cert}</span>

              <div className="flex gap-2 text-xs">
                <button onClick={() => openCertDrawer(cert, i)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDeleteCert(i)} className="text-red-500">Delete</button>
              </div>
            </div>
          ))} */}

          {certifications.map((cert) => (
  <div key={cert.id} className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded mb-2">
    
    <span>{cert.name}</span>

    <div className="flex gap-2 text-xs">
      <button onClick={() => openCertDrawer(cert.name, cert.id)} className="text-blue-600">
        Edit
      </button>

      <button onClick={() => handleDeleteCert(cert.id)} className="text-red-500">
        Delete
      </button>
    </div>

  </div>
))}
        </div>

        {/* 🔥 RESUME */}
      

        <div ref={resumeRef} className="bg-white rounded-2xl p-5 shadow-sm">

  <h3 className="font-semibold mb-3">Resume</h3>

  {/* UPLOAD BOX */}
  <div
    className="border-dashed border-2 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition"
    onClick={() => fileInputRef.current?.click()}
  >
    Upload Resume (PDF / DOC)
  </div>

  {/* HIDDEN INPUT */}
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    className="hidden"
  />

  {/* LIST */}
  <div className="mt-4 space-y-3">

    {resumes.length === 0 && (
      <p className="text-sm text-muted-foreground">
        No resume uploaded yet
      </p>
    )}

    {resumes.map((res) => (
      <div
        key={res.id}
        className="flex justify-between items-center border rounded-lg px-3 py-2"
      >

        {/* FILE NAME */}
        <span className="text-sm truncate">
          {res.file_name}
        </span>

        {/* ACTIONS */}
        <div className="flex gap-3 text-xs">

          <button
            onClick={() => handleDownloadResume(res.id, res.file_name)}
            className="text-blue-600 font-semibold"
          >
            Download
          </button>

          <button
            onClick={() => handleDeleteResume(res.id)}
            className="text-red-500 font-semibold"
          >
            Delete
          </button>

        </div>

      </div>
    ))}

  </div>

</div>

      </div>
    </div>

    {/* 🔥 KEEP YOUR DRAWERS BELOW (NO CHANGE) */}
{showExpDrawer && (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

    <div className="w-[450px] bg-white h-full p-6 overflow-y-auto">

      <h2 className="text-lg font-bold mb-4">Employment</h2>

      {/* CURRENT */}
      <div className="mb-4">
        <label>
          <input
            type="radio"
            checked={expForm.current === "yes"}
            onChange={() =>
              setExpForm({ ...expForm, current: "yes" })
            }
          /> Yes
        </label>

        <label className="ml-4">
          <input
            type="radio"
            checked={expForm.current === "no"}
            onChange={() =>
              setExpForm({ ...expForm, current: "no" })
            }
          /> No
        </label>
      </div>

      {/* COMPANY */}
      <input
        value={expForm.company}
        onChange={(e) =>
          setExpForm({ ...expForm, company: e.target.value })
        }
        placeholder="Company"
        className="w-full border p-2 mb-3"
      />

      {/* TITLE */}
      <input
        value={expForm.title}
        onChange={(e) =>
          setExpForm({ ...expForm, title: e.target.value })
        }
        placeholder="Job Title"
        className="w-full border p-2 mb-3"
      />

      {/* EXPERIENCE */}
      {expForm.current === "yes" && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={expForm.years}
            onChange={(e) =>
              setExpForm({ ...expForm, years: e.target.value })
            }
          >
            {[...Array(31)].map((_, i) => (
              <option key={i} value={i}>{i} Years</option>
            ))}
          </select>

          <select
            value={expForm.months}
            onChange={(e) =>
              setExpForm({ ...expForm, months: e.target.value })
            }
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i}>{i} Months</option>
            ))}
          </select>
        </div>
      )}

      {/* DATES */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          value={expForm.start_year}
          onChange={(e) =>
            setExpForm({ ...expForm, start_year: e.target.value })
          }
          placeholder="Start Year"
          className="border p-2"
        />

        <input
          value={expForm.start_month}
          onChange={(e) =>
            setExpForm({ ...expForm, start_month: e.target.value })
          }
          placeholder="Start Month"
          className="border p-2"
        />
      </div>

      {expForm.current === "no" && (
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            value={expForm.end_year}
            onChange={(e) =>
              setExpForm({ ...expForm, end_year: e.target.value })
            }
            placeholder="End Year"
            className="border p-2"
          />

          <input
            value={expForm.end_month}
            onChange={(e) =>
              setExpForm({ ...expForm, end_month: e.target.value })
            }
            placeholder="End Month"
            className="border p-2"
          />
        </div>
      )}

      {/* DESCRIPTION */}
      <textarea
        value={expForm.description}
        onChange={(e) =>
          setExpForm({ ...expForm, description: e.target.value })
        }
        placeholder="Description"
        className="w-full border p-2 mb-4"
      />

      {/* BUTTONS */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowExpDrawer(false)}
          className="border px-3 py-1"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveExperience}
          className="bg-blue-600 text-white px-4 py-1"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

  {showExpDrawer && (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">

    <div className="w-[500px] bg-white h-full p-6 overflow-y-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Employment</h2>
        <button onClick={() => setShowExpDrawer(false)}>✕</button>
      </div>

      {/* CURRENT EMPLOYMENT */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Is this your current employment?</p>
        <div className="flex gap-4 text-sm">
          <label>
            <input
              type="radio"
              checked={expForm.current === "yes"}
              onChange={() => setExpForm({ ...expForm, current: "yes" })}
            /> Yes
          </label>
          <label>
            <input
              type="radio"
              checked={expForm.current === "no"}
              onChange={() => setExpForm({ ...expForm, current: "no" })}
            /> No
          </label>
        </div>
      </div>

      {/* EMPLOYMENT TYPE */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Employment type</p>
        <div className="flex gap-4 text-sm">
          <label>
            <input
              type="radio"
              checked={expForm.employment_type === "full-time"}
              onChange={() =>
                setExpForm({ ...expForm, employment_type: "full-time" })
              }
            /> Full-time
          </label>
          <label>
            <input
              type="radio"
              checked={expForm.employment_type === "internship"}
              onChange={() =>
                setExpForm({ ...expForm, employment_type: "internship" })
              }
            /> Internship
          </label>
        </div>
      </div>


 
      {/* EXPERIENCE ONLY FOR CURRENT */}
   {expForm.current === "yes" && (
  <>
    <p className="text-sm font-semibold mb-2">
      Total Experience
    </p>

    <div className="grid grid-cols-2 gap-3 mb-4">
      <select
        value={expForm.years}
        onChange={(e) =>
          setExpForm({ ...expForm, years: e.target.value })
        }
        className="border rounded-lg px-3 py-2 text-sm"
      >
        {[...Array(31)].map((_, i) => (
          <option key={i} value={i}>
            {i} Years
          </option>
        ))}
      </select>

      <select
        value={expForm.months}
        onChange={(e) =>
          setExpForm({ ...expForm, months: e.target.value })
        }
        className="border rounded-lg px-3 py-2 text-sm"
      >
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i}>
            {i} Months
          </option>
        ))}
      </select>
    </div>
  </>
)}

      {/* COMPANY */}
      <div className="mb-4">
        <label className="text-sm font-semibold">
          {expForm.current === "yes"
            ? "Current company name *"
            : "Previous company name *"}
        </label>

        <input
          value={expForm.company}
          onChange={(e) =>
            setExpForm({ ...expForm, company: e.target.value })
          }
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Type your organization"
        />
      </div>

      {/* TITLE */}
      <div className="mb-4">
        <label className="text-sm font-semibold">
          {expForm.current === "yes"
            ? "Current job title *"
            : "Previous job title *"}
        </label>

        <input
          value={expForm.title}
          onChange={(e) =>
            setExpForm({ ...expForm, title: e.target.value })
          }
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Type your designation"
        />
      </div>

      {/* JOINING DATE */}
      <div className="grid grid-cols-2 gap-3 mb-4">

  <p className="text-sm font-semibold col-span-2">
    Joining date
  </p>

  <select
    value={expForm.start_year}
    onChange={(e) =>
      setExpForm({ ...expForm, start_year: e.target.value })
    }
    className="border rounded-lg px-3 py-2 text-sm"
  >
    <option value="">Select Year</option>
    {Array.from({ length: 50 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return <option key={year} value={year}>{year}</option>;
    })}
  </select>

  <select
    value={expForm.start_month}
    onChange={(e) =>
      setExpForm({ ...expForm, start_month: e.target.value })
    }
    className="border rounded-lg px-3 py-2 text-sm"
  >
    <option value="">Select Month</option>
    {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
      .map((m, i) => (
        <option key={i} value={i+1}>{m}</option>
    ))}
  </select>

</div>

      {/* WORKED TILL (ONLY IF NO) */}
     {expForm.current === "no" && (
  <div className="grid grid-cols-2 gap-3 mb-4">

    {/* LABEL */}
    <p className="text-sm font-semibold col-span-2">
      Worked till
    </p>

    {/* END YEAR */}
    <select
      value={expForm.end_year}
      onChange={(e) =>
        setExpForm({ ...expForm, end_year: e.target.value })
      }
      className="border rounded-lg px-3 py-2 text-sm"
    >
      <option value="">Select Year</option>

      {Array.from({ length: 50 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return (
          <option key={year} value={year}>
            {year}
          </option>
        );
      })}
    </select>

    {/* END MONTH */}
    <select
      value={expForm.end_month}
      onChange={(e) =>
        setExpForm({ ...expForm, end_month: e.target.value })
      }
      className="border rounded-lg px-3 py-2 text-sm"
    >
      <option value="">Select Month</option>

      {[
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ].map((m, i) => (
        <option key={i} value={i + 1}>
          {m}
        </option>
      ))}
    </select>

  </div>
)}

      {/* SALARY (ONLY CURRENT) */}
      {expForm.current === "yes" && (
        <div className="mb-4">
          <label className="text-sm font-semibold">Current salary *</label>
          <input
            value={expForm.salary}
            onChange={(e) =>
              setExpForm({ ...expForm, salary: e.target.value })
            }
            className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="12,00,000"
          />
        </div>
      )}

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="text-sm font-semibold">Job profile</label>
        <textarea
          value={expForm.description}
          onChange={(e) =>
            setExpForm({ ...expForm, description: e.target.value })
          }
          className="w-full px-3 py-2 text-sm outline-none border rounded-lg"
          rows={4}
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowExpDrawer(false)}
          className="text-sm text-muted-foreground"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveExperience}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}

    {showEduDrawer && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">

    <div className="w-[500px] bg-white h-full flex flex-col shadow-2xl animate-slideInRight">

      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-bold">
          {editEduIndex !== null ? "Edit Education" : "Add Education"}
        </h2>

        <button
          onClick={() => setShowEduDrawer(false)}
          className="text-muted-foreground hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-4 overflow-y-auto">

        {/* EDUCATION LEVEL */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Education *
          </label>
          <select
          value={eduForm.education}
          onChange={(e) => handleEducationChange(Number(e.target.value))}
          className="w-full border rounded-xl px-4 py-3 text-sm"
        >
          <option value="">Select</option>

          {educations.map((edu) => (
            <option key={edu.id} value={edu.id}>
              {edu.name}
            </option>
          ))}
        </select>
        </div>

        {/* COURSE */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Course *
          </label>
          <select
  value={eduForm.course}
  onChange={(e) => handleCourseChange(Number(e.target.value))}
  className="w-full border rounded-xl px-4 py-3 text-sm"
>
  <option value="">Select</option>

  {courses.map((c) => (
    <option key={c.id} value={c.id}>
      {c.name}
    </option>
  ))}
        </select>
        </div>

        {/* SPECIALIZATION */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Specialization
          </label>
         <select
  value={eduForm.specialization}
  onChange={(e) =>
    setEduForm({ ...eduForm, specialization: Number(e.target.value) })
  }
  className="w-full border rounded-xl px-4 py-3 text-sm"
>
  <option value="">Select</option>

  {specializations.map((s) => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
        </select>
        </div>

        {/* UNIVERSITY */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            University / Institute *
          </label>
          <input
            value={eduForm.institution}
            onChange={(e) =>
              setEduForm({ ...eduForm, institution: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-3 text-sm"
            placeholder="Enter institute name"
          />
        </div>

        {/* COURSE TYPE */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Course type *
          </label>

          <div className="flex gap-4 text-sm">
            {["Full time", "Part time", "Distance"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={eduForm.courseType === type}
                  onChange={() =>
                    setEduForm({ ...eduForm, courseType: type })
                  }
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* YEAR */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={eduForm.startYear}
            onChange={(e) =>
              setEduForm({ ...eduForm, startYear: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option>Select Start Year</option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year}>{year}</option>;
            })}
          </select>

          <select
            value={eduForm.endYear}
            onChange={(e) =>
              setEduForm({ ...eduForm, endYear: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option>Select End Year</option>
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year}>{year}</option>;
            })}
          </select>
        </div>

        {/* GRADING SYSTEM */}
      <div>
        <label className="text-sm font-semibold mb-1 block">
          Grading system *
        </label>

        <select
          value={eduForm.gradingSystem || ''}
          onChange={(e) =>
            setEduForm({ ...eduForm, gradingSystem: e.target.value })
          }
          className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
        >
          <option value="">Select grading system</option>

          <option value="cgpa_10">CGPA out of 10</option>
          <option value="cgpa_4">CGPA out of 4</option>
          <option value="percentage">Percentage</option>
          <option value="grade">Grade</option>
        </select>
      </div>

      </div>

      {/* FOOTER */}
      <div className="border-t px-6 py-4 flex justify-end gap-3">

        <button
          onClick={() => setShowEduDrawer(false)}
          className="px-4 py-2 rounded-xl border text-sm"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveEducation}
          className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #0891B2, #0E7490)' }}
        >
          Save
        </button>

      </div>

    </div>
  </div>
  )}





{showCertDrawer && (
  <div className="fixed inset-0 z-50 flex">

    {/* OVERLAY */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowCertDrawer(false)}
    />

    {/* DRAWER */}
    <div className="ml-auto w-full sm:w-[400px] h-full bg-white shadow-2xl p-6 relative animate-slideIn">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {editCertId ? "Edit Certification" : "Add Certification"}
        </h3>

        <button
          onClick={() => setShowCertDrawer(false)}
          className="text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>
      </div>

      {/* INPUT */}
      <div className="mb-4">
        <label className="text-sm font-medium mb-1 block">
          Certification Name
        </label>

        <input
          value={certInput}
          onChange={(e) => setCertInput(e.target.value)}
          placeholder="e.g. AWS Certified Developer"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* ACTIONS */}
      <div className="absolute bottom-6 left-6 right-6 flex gap-3">

        <button
          onClick={() => setShowCertDrawer(false)}
          className="flex-1 border rounded-lg py-2 text-sm font-medium"
        >
          Cancel
        </button>

        <button
          onClick={handleSaveCert}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-blue-700 transition"
        >
          Save
        </button>

      </div>

    </div>
  </div>
)}

  </div>
);

}
