import React, { useState } from "react";

const ConfirmModal = ({ student, teachers, onConfirm, onClose }) => {
  const [selectedTeacher, setSelectedTeacher] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">O‘qituvchini tanlang</h2>
        <p className="mb-2"><strong>O‘quvchi:</strong> {student.fullName}</p>
        <p className="mb-4"><strong>Fan:</strong> {student.subject}</p>

        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full border px-4 py-2 rounded-xl mb-4"
        >
          <option value="">O‘qituvchini tanlang</option>
          {teachers.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-xl"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => onConfirm(selectedTeacher)}
            disabled={!selectedTeacher}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
