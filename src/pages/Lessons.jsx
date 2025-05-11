import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";

const Lessons = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null); // For editing schedule

  const fetchSubjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "subjects"));
      const fetchedSubjects = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(fetchedSubjects);
    } catch (error) {
      toast.error("Fanlarni yuklashda xatolik yuz berdi.");
    }
  };

  const handleAddSchedule = async () => {
    if (!selectedTeacher || !selectedTime)
      return toast.warning("Iltimos, o'qituvchi va dars vaqtini tanlang.");

    const subject = subjects.find((subj) => subj.id === selectedSubjectId);
    const teacher = subject.teachers.find((teacher) => teacher.name === selectedTeacher);

    if (!teacher.schedule) {
      teacher.schedule = [];
    }

    teacher.schedule.push(selectedTime);

    try {
      const subjectRef = doc(db, "subjects", selectedSubjectId);
      await updateDoc(subjectRef, {
        teachers: subject.teachers,
      });
      toast.success("Dars vaqti muvaffaqiyatli qo‘shildi!");
      setSelectedTeacher(null);
      setSelectedTime("");
      fetchSubjects();
    } catch (error) {
      toast.error("Dars vaqti qo‘shishda xatolik yuz berdi.");
    }
  };

  const handleEditSchedule = (teacher, time) => {
    setSelectedTeacher(teacher.name);
    setSelectedTime(time);
    setEditingSchedule(time); // Mark the schedule as being edited
  };

  const handleSaveSchedule = async () => {
    if (!selectedTime) {
      return toast.warning("Dars vaqti kiritilmadi.");
    }

    const subject = subjects.find((subj) => subj.id === selectedSubjectId);
    const teacher = subject.teachers.find((teacher) => teacher.name === selectedTeacher);
    
    // Find and update the schedule
    const index = teacher.schedule.indexOf(editingSchedule);
    if (index !== -1) {
      teacher.schedule[index] = selectedTime; // Update the time
    }

    try {
      const subjectRef = doc(db, "subjects", selectedSubjectId);
      await updateDoc(subjectRef, {
        teachers: subject.teachers,
      });
      toast.success("Dars vaqti muvaffaqiyatli yangilandi!");
      setEditingSchedule(null); // Clear the edit mode
      setSelectedTeacher(null);
      setSelectedTime("");
      fetchSubjects();
    } catch (error) {
      toast.error("Dars vaqti yangilashda xatolik yuz berdi.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-amber-50 text-2xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Fanlar va O‘qituvchilar</h2>

      <div className="space-y-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-xl shadow-md p-6 border flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-3xl font-semibold">{subject.name}</h3>
            </div>

            <ul className="list-disc list-inside text-lg text-gray-700 mt-3 space-y-1 flex flex-col gap-5">
              {subject.teachers.length > 0 ? (
                subject.teachers.map((teacher, index) => (
                  <li key={index} className="flex justify-between items-center text-2xl">
                    <span>
                      <strong>{teacher.name}</strong> — {teacher.phone}
                    </span>
                    <ul className="list-disc list-inside text-gray-600 mt-2">
                      {teacher.schedule?.length > 0 ? (
                        teacher.schedule.map((time, i) => (
                          <li key={i} className="text-md flex justify-between items-center">
                            <span>{time}</span>
                            <button
                              onClick={() => handleEditSchedule(teacher, time)}
                              className="text-blue-600 hover:underline ml-2"
                            >
                              Tahrirlash
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="text-md text-gray-500">Dars vaqti kiritilmagan</li>
                      )}
                    </ul>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Hozircha o‘qituvchi yo‘q.</p>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Dars vaqti qo'shish */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6 border flex flex-col gap-4">
        <h3 className="text-2xl font-semibold mb-4">Dars vaqti qo‘shish</h3>

        <div className="mb-4">
          <label htmlFor="subject" className="text-lg">Fanni tanlang:</label>
          <select
            id="subject"
            className="px-4 py-3 border rounded-lg w-full mt-2"
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            value={selectedSubjectId || ""}
          >
            <option value="">-- Fanni tanlang --</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {selectedSubjectId && (
          <div>
            <label htmlFor="teacher" className="text-lg">O‘qituvchini tanlang:</label>
            <select
              id="teacher"
              className="px-4 py-3 border rounded-lg w-full mt-2"
              onChange={(e) => setSelectedTeacher(e.target.value)}
              value={selectedTeacher || ""}
            >
              <option value="">-- O‘qituvchini tanlang --</option>
              {subjects
                .find((subject) => subject.id === selectedSubjectId)
                .teachers.map((teacher, index) => (
                  <option key={index} value={teacher.name}>
                    {teacher.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {selectedTeacher && (
          <div className="mt-4">
            <label htmlFor="time" className="text-lg">Dars vaqti:</label>
            <input
              type="text"
              id="time"
              className="px-4 py-3 border rounded-lg w-full mt-2"
              placeholder="Masalan: 10:00 - 12:00"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={editingSchedule ? handleSaveSchedule : handleAddSchedule}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-700"
        >
          {editingSchedule ? "Dars vaqti yangilash" : "Dars vaqti qo‘shish"}
        </button>
      </div>
    </div>
  );
};

export default Lessons;
