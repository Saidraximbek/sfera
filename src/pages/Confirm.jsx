import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Loader komponenti
const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

const Confirm = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editedFullName, setEditedFullName] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");  // Filter state

  const navigate = useNavigate();  // Initialize the navigate function

  const subjects = [
    {
      group: "Asosiy fanlar",
      options: ["Ingliz tili", "Matematika", "Biologiya"],
    },
    {
      group: "Til fanlari",
      options: ["Koreys tili", "Arab tili", "Nemis tili"],
    },
    { group: "Maxsus kurslar", options: ["Ingliz tili KIDS"] },
  ];

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "confirmedStudents"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Ma’lumotlarni olishda xatolik:", error);
      toast.error("Ma’lumotlarni olishda xatolik yuz berdi!");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditedFullName(student.fullName);
    setEditedSubject(student.subject);
    setEditedPhone(student.phone);
  };

  const handleSave = async () => {
    try {
      if (editingStudent) {
        await updateDoc(doc(db, "confirmedStudents", editingStudent.id), {
          fullName: editedFullName,
          subject: editedSubject,
          phone: editedPhone,
        });

        setStudents((prev) =>
          prev.map((student) =>
            student.id === editingStudent.id
              ? {
                  ...student,
                  fullName: editedFullName,
                  subject: editedSubject,
                  phone: editedPhone,
                }
              : student
          )
        );

        setEditingStudent(null);
        toast.success("O'quvchi ma'lumotlari muvaffaqiyatli saqlandi!");
      }
    } catch (error) {
      console.error("Tahrirlashda xatolik:", error);
      toast.error("Saqlashda xatolik yuz berdi!");
    }
  };

  const handleDelete = async () => {
    try {
      if (studentToDelete) {
        await deleteDoc(doc(db, "confirmedStudents", studentToDelete.id));
        setStudents((prev) =>
          prev.filter((student) => student.id !== studentToDelete.id)
        );
        setShowDeleteModal(false);
        toast.success("O'quvchi ma'lumotlari o'chirildi!");
      }
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      toast.error("O'chirishda xatolik yuz berdi!");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = (student) => {
    setShowDeleteModal(true);
    setStudentToDelete(student);
  };

  const handleFilterChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    selectedSubject ? student.subject === selectedSubject : true
  );

  const handleFullDetailsClick = (student) => {
    // Navigate to StudentPage and pass student details
    navigate(`/student/${student.id}`, { state: student });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-[800px] mx-auto bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Ta'lim olayotgan o'quvchilar
      </h2>

      {/* Filter Section */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Fan bo‘yicha filtr
        </label>
        <select
          value={selectedSubject}
          onChange={handleFilterChange}
          className="w-full text-xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Barchasini ko‘rsatish</option>
          {subjects.map((subjectGroup, index) => (
            <optgroup key={index} label={subjectGroup.group}>
              {subjectGroup.options.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <ul className="space-y-6 text-2xl">
        {filteredStudents.map((student) => (
          <li
            key={student.id}
            className={`border-2 p-6 rounded-xl shadow-md bg-white flex justify-between items-center transition-all duration-300 ease-in-out transform ${
              editingStudent?.id === student.id
                ? "border-green-500"
                : "border-gray-300"
            }`}
          >
            <div className="text-2xl text-gray-700 flex flex-col gap-6">
              <p className="text-2xl flex items-center gap-4">
                <strong>Ism Familiya: </strong> {student.fullName}
              </p>
              <p className="text-2xl flex items-center gap-4">
                <strong>Fan:</strong> {student.subject}
              </p>
              <p className="text-2xl flex items-center gap-4">
                <strong>Tel:</strong> {student.phone}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(student)}
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition ease-in-out duration-200"
              >
                Tahrirlash
              </button>
              <button
                onClick={() => handleConfirmDelete(student)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition ease-in-out duration-200"
              >
                O'chirish
              </button>
              <button
                onClick={() => handleFullDetailsClick(student)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ease-in-out duration-200"
              >
                To'liq ma'lumot
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Modal */}
      {showDeleteModal && studentToDelete && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] flex justify-center items-center gap-15 text-xl">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-7">
            <h3 className="text-3xl font-semibold mb-4">
              O'chirishni tasdiqlang
            </h3>
            <p className="mb-4">
              Siz rostdan ham {studentToDelete.fullName} o'chirmoqchimisiz?
            </p>
            <div className="flex w-full justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
              >
                Ha, o'chirish
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500"
              >
                Yo'q, bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Section */}
      {editingStudent && (
        <div className="mt-8 p-6 border rounded-xl shadow-md bg-white border-green-500">
          <h3 className="text-2xl font-bold mb-6">Tahrir qilish</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Ism Familiya
              </label>
              <input
                type="text"
                value={editedFullName}
                onChange={(e) => setEditedFullName(e.target.value)}
                className="w-full text-2xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fan
              </label>
              <select
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="w-full text-2xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((subjectGroup, index) => (
                  <optgroup key={index} label={subjectGroup.group}>
                    {subjectGroup.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefon raqami:
              </label>
              <input
                type="text"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                className="w-full text-2xl px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
            >
              Saqlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirm;
