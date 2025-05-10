import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Loader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-12 h-12 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
  </div>
);

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editedFullName, setEditedFullName] = useState("");
  const [editedSubject, setEditedSubject] = useState("");
  const [editedPhone, setEditedPhone] = useState("");

  const subjects = [
    "Koreys tili",
    "Ingliz tili",
    "Arab tili",
    "Matematika",
    "Ingliz tili KIDS",
    "Biologiya",
    "Nemis tili",
    "Kompyuter savodxonligi", 
    "Frontend",               
    "Backend",                
  ];

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Ma’lumotlarni olishda xatolik:", error);
      toast.error("Ma’lumotlarni olishda xatolik!", {
        style: { fontSize: "16px" }, 
      });
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
        await updateDoc(doc(db, "students", editingStudent.id), {
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
        toast.success("O'quvchi ma'lumotlari saqlandi!", {
          style: { fontSize: "16px" }, 
        });
      }
    } catch (error) {
      console.error("Tahrirlashda xatolik:", error);
      toast.error("Tahrirlashda xatolik!", {
        style: { fontSize: "16px" }, 
      });
    }
  };

  const confirmStudent = async (student) => {
    try {
      await setDoc(doc(db, "confirmedStudents", student.id), {
        fullName: student.fullName,
        subject: student.subject,
        phone: student.phone,
      });

      await deleteDoc(doc(db, "students", student.id));
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      toast.success("O‘quvchi tasdiqlandi!", {
        style: { fontSize: "16px" }, 
      });
    } catch (error) {
      console.error("Tasdiqlashda xatolik:", error);
      toast.error("Tasdiqlashda xatolik!", {
        style: { fontSize: "16px" }, 
      });
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      await deleteDoc(doc(db, "students", studentId));
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      toast.success("O‘quvchi o‘chirildi!", {
        style: { fontSize: "16px" }, 
      });
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
      toast.error("O‘chirishda xatolik!", {
        style: { fontSize: "16px" }, 
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-4 max-w-5xl mx-auto flex flex-col ">
      <h2 className="text-3xl font-bold mb-6 text-white self-center">Tasdiqlanmagan O'quvchilar</h2>
      <ul className="space-y-6">
        {students.map((student) => (
          <li
            key={student.id}
            className="bg-white text-xl rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
          >
            <div className="flex flex-col gap-4">
              <p className="text-xl">
                <span className="font-semibold text-gray-700">Ism Familya:</span>{" "}
                {student.fullName}
              </p>
              <p className="text-xl">
                <span className="font-semibold text-gray-700">Fan:</span>{" "}
                {student.subject}
              </p>
              <p className="text-xl">
                <span className="font-semibold text-gray-700">Tel:</span>{" "}
                {student.phone}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => confirmStudent(student)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-2xl transition"
              >
                Tasdiqlash
              </button>
              <button
                onClick={() => deleteStudent(student.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-2xl transition"
              >
                O‘chirish
              </button>
              <button
                onClick={() => handleEdit(student)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-2xl transition"
              >
                Tahrirlash
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingStudent && (
        <div className="mt-10 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-blue-700">Tahrir qilish</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                Ism Familya
              </label>
              <input
                type="text"
                value={editedFullName}
                onChange={(e) => setEditedFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Fan</label>
              <select
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Telefon</label>
              <input
                type="text"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl transition"
            >
              Saqlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
