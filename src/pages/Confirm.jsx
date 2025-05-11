import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Confirm = () => {
  const [students, setStudents] = useState([]);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editedStudent, setEditedStudent] = useState({
    fullName: "",
    subject: "",
    phone: "",
    teacher: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      const subjectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectsData);
    };

    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "confirmedStudents"));
      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    };

    fetchSubjects();
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setEditStudentId(student.id);
    setEditedStudent({
      fullName: student.fullName || "",
      subject: student.subject || "",
      phone: student.phone || "",
      teacher: student.teacher || "",
    });
  };

  const handleSave = async (id) => {
    const studentRef = doc(db, "confirmedStudents", id);
    await updateDoc(studentRef, editedStudent);
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...editedStudent } : s))
    );
    setEditStudentId(null);
  };

  const handleDelete = async () => {
    if (studentToDelete) {
      await deleteDoc(doc(db, "confirmedStudents", studentToDelete.id));
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      setShowDeleteModal(false);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto p-6 bg-amber-50 transition duration-300 ease-in-out transform">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Tasdiqlangan o‘quvchilar</h2>
      <div className="mb-4">
        {/* Fanlar bo'yicha filtr */}
        <select className="border px-4 py-2 rounded-md text-base" onChange={(e) => setFilteredSubject(e.target.value)}>
          <option value="">Barchasi</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>
      <table className="table-auto w-full text-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-6 py-3 text-left">Ism</th>
            <th className="px-6 py-3 text-left">Fan</th>
            <th className="px-6 py-3 text-left">Telefon</th>
            <th className="px-6 py-3 text-left">O‘qituvchi</th>
            <th className="px-6 py-3 text-left">Amallar</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-t hover:bg-gray-100 transition-all duration-300 ease-in-out"
            >
              {editStudentId === student.id ? (
                <tr>
                  <td className="py-3 px-6">
                    <input
                      type="text"
                      value={editedStudent.fullName}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          fullName: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded w-full text-base"
                    />
                  </td>
                  <td className="py-3 px-6">
                    <select
                      value={editedStudent.subject}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          subject: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded w-full text-base"
                    >
                      <option value="">Tanlang</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.name}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-6">
                    <input
                      type="text"
                      value={editedStudent.phone}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          phone: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded w-full text-base"
                    />
                  </td>
                  <td className="py-3 px-6">
                    <select
                      value={editedStudent.teacher}
                      onChange={(e) =>
                        setEditedStudent({
                          ...editedStudent,
                          teacher: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded w-full text-base"
                    >
                      <option value="">Tanlang</option>
                      {subjects
                        .filter((subject) => subject.name === editedStudent.subject)
                        .flatMap((subject) => subject.teachers)
                        .map((teacher, index) => (
                          <option key={index} value={teacher.name}>
                            {teacher.name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="py-3 px-6 space-x-2">
                    <button
                      onClick={() => handleSave(student.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-transform duration-200 ease-in-out hover:scale-105"
                    >
                      Saqlash
                    </button>
                    <button
                      onClick={() => setEditStudentId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-transform duration-200 ease-in-out hover:scale-105"
                    >
                      Bekor
                    </button>
                  </td>
                </tr>
              ) : (
                <>
                  <td className="py-3 px-6">{student.fullName}</td>
                  <td className="py-3 px-6">{student.subject}</td>
                  <td className="py-3 px-6">{student.phone}</td>
                  <td className="py-3 px-6">{student.teacher}</td>
                  <td className="py-3 px-6 space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-transform duration-200 ease-in-out hover:scale-105"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => {
                        setStudentToDelete(student);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-transform duration-200 ease-in-out hover:scale-105"
                    >
                      O‘chirish
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/student/${student.id}`, { state: student })
                      }
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-transform duration-200 ease-in-out hover:scale-105"
                    >
                      To‘liq ma’lumot
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* O'chirish oynasi */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md transition-all duration-300 ease-in-out transform scale-105">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Rostdan ham o‘chirmoqchimisiz?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Bekor
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                O‘chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Confirm;
