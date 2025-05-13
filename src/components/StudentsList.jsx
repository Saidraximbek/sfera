import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editedData, setEditedData] = useState({
    fullName: "",
    subject: "",
    phone: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [lessonTime, setLessonTime] = useState(""); // New
  const [teacherSchedule, setTeacherSchedule] = useState([]); // To store selected teacher's schedule
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
      const studentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    });

    const unsubscribeSubjects = onSnapshot(collection(db, "subjects"), (snapshot) => {
      const subjectsData = snapshot.docs.map((doc) => doc.data());
      setSubjects(subjectsData);
    });

    return () => {
      unsubscribe();
      unsubscribeSubjects();
    };
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Haqiqatan ham o‘chirmoqchimisiz?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("O‘quvchi o‘chirildi!");
    } catch (error) {
      toast.error("Xatolik yuz berdi!");
    }
  };

  const handleEdit = (student) => {
    setEditingStudentId(student.id);
    setEditedData({
      fullName: student.fullName,
      subject: student.subject,
      phone: student.phone,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "students", id), editedData);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...editedData } : s))
      );
      toast.success("O‘quvchi yangilandi!");
      setEditingStudentId(null);
    } catch (error) {
      toast.error("Xatolik yuz berdi!");
    }
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
  };

  const handleConfirmStudent = (student) => {
    setSelectedTeacher("");
    setLessonTime(""); // Reset lesson time
    setCurrentStudent(student);
    setIsConfirmModalOpen(true);
  };

  const handleTeacherAssign = async () => {
    if (!selectedTeacher) {
      toast.error("Iltimos, o‘qituvchi tanlang!");
      return;
    }
    if (!lessonTime.trim()) {
      toast.error("Iltimos, dars vaqtini kiriting!");
      return;
    }

    try {
      await setDoc(doc(db, "confirmedStudents", currentStudent.id), {
        fullName: currentStudent.fullName,
        subject: currentStudent.subject,
        phone: currentStudent.phone,
        teacher: selectedTeacher,
        lessonTime: lessonTime,
      });

      await deleteDoc(doc(db, "students", currentStudent.id));
      setStudents((prev) =>
        prev.filter((s) => s.id !== currentStudent.id)
      );

      toast.success("O‘quvchi tasdiqlandi va o‘qituvchi biriktirildi!");
      setIsConfirmModalOpen(false);
      setCurrentStudent(null);
    } catch (error) {
      toast.error("Tasdiqlashda xatolik yuz berdi!");
    }
  };

  // Fetch teacher's schedule when teacher is selected
  useEffect(() => {
    if (selectedTeacher && currentStudent) {
      const teacher = subjects
        .find((subject) => subject.name === currentStudent.subject)
        ?.teachers.find((teacher) => teacher.name === selectedTeacher);

      if (teacher && teacher.schedule) {
        setTeacherSchedule(teacher.schedule);
      } else {
        setTeacherSchedule([]); // If no schedule found, reset
      }
    }
  }, [selectedTeacher, currentStudent, subjects]);

  return (
    <div className=" text-2xl">
    
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">F.I.Sh</th>
              <th className="py-2 px-4 border-b">Fan</th>
              <th className="py-2 px-4 border-b">Telefon</th>
              <th className="py-2 px-4 border-b">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className="border-b text-center">
                <td className="py-2 px-4">{index + 1}</td>

                {editingStudentId === student.id ? (
                  <>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={editedData.fullName}
                        onChange={(e) =>
                          setEditedData({ ...editedData, fullName: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <select
                        value={editedData.subject}
                        onChange={(e) =>
                          setEditedData({ ...editedData, subject: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="">Fan tanlang</option>
                        {subjects.map((subject, index) => (
                          <option key={index} value={subject.name}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={editedData.phone}
                        onChange={(e) =>
                          setEditedData({ ...editedData, phone: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleSaveEdit(student.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl"
                      >
                        Saqlash
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-xl"
                      >
                        Bekor
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4">{student.fullName}</td>
                    <td className="py-2 px-4">{student.subject}</td>
                    <td className="py-2 px-4">{student.phone}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-xl"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                      >
                        O‘chirish
                      </button>
                      <button
                        onClick={() => handleConfirmStudent(student)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl"
                      >
                        Tasdiqlash
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-[500px]">
            <h3 className="text-xl font-bold mb-4">O‘quvchi tasdiqlash</h3>
            <p className="mb-2">Iltimos, o‘qituvchini tanlang:</p>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="border px-2 py-1 rounded mb-4 w-full"
            >
              <option value="">O‘qituvchi tanlang</option>
              {subjects
                .filter((subject) => subject.name === currentStudent.subject)
                .flatMap((subject) => subject.teachers)
                .map((teacher, index) => (
                  <option key={index} value={teacher.name}>
                    {teacher.name}
                  </option>
                ))}
            </select>

            <p className="mb-2">Iltimos, dars vaqtini tanlang:</p>
            <select
              value={lessonTime}
              onChange={(e) => setLessonTime(e.target.value)}
              className="border px-2 py-1 rounded mb-4 w-full"
            >
              <option value="">Dars vaqtini tanlang</option>
              {teacherSchedule.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleTeacherAssign}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Tasdiqlash
              </button>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
