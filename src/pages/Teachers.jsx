import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const Groups = () => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(""); // Default value is empty
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students based on selected teacher

  const fetchTeachers = async () => {
    const snapshot = await getDocs(collection(db, "subjects"));
    const allTeachers = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.teachers && Array.isArray(data.teachers)) {
        data.teachers.forEach((teacher) => {
          if (!allTeachers.find((t) => t.name === teacher.name)) {
            allTeachers.push(teacher);
          }
        });
      }
    });
    setTeachers(allTeachers);
  };

  const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, "confirmedStudents"));
    const allStudents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(allStudents);
  };

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      // Filter students based on selected teacher
      const filtered = students.filter((student) => student.teacher === selectedTeacher);
      setFilteredStudents(filtered);
    }
  }, [selectedTeacher, students]);

  return (
    <div className="max-w-10xl mx-auto px-4 py-12 bg-amber-50 rounded-2xl">
      <h1 className="text-5xl font-bold text-center text-gray-800 mb-12">
        O‘qituvchilar Guruhlari
      </h1>

      {/* Teacher Select Dropdown */}
      <div className="mb-8 flex justify-center">
        <select
          className="border border-gray-300 rounded-xl px-4 py-2 text-xl w-1/3"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">O'qituvchi tanlang</option>
          {teachers.map((teacher, index) => (
            <option key={index} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table for Displaying Students */}
      {selectedTeacher && filteredStudents.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm text-2xl">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2 text-left">O'quvchi ismi</th>
              <th className="px-4 py-2 text-left">Dars kunlari</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-t border-gray-200">
                <td className="px-4 py-2">
                  <span className="font-semibold">{student.fullName}</span>{" "}
                  <span className="text-gray-500">({student.subject})</span>
                </td>
                <td className="px-4 py-2">
                  {student.lessonTime ? (
                    <span className="text-gray-600">{student.lessonTime}</span>
                  ) : (
                    <span className="text-gray-400">Ma'lumot yo'q</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedTeacher ? (
        <p className="text-gray-500 mt-2 text-xl">Hozircha o‘quvchi biriktirilmagan.</p>
      ) : (
        <p className="text-gray-500 mt-2 text-xl">Iltimos, o‘qituvchi tanlang.</p>
      )}
    </div>
  );
};

export default Groups;
