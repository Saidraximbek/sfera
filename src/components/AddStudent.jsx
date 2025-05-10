import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddStudent = () => {
  const [fullName, setFullName] = useState("");
  const [subject, setSubject] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "students"), {
        fullName,
        subject,
        phone,
        createdAt: Timestamp.now(),
      });

      toast.success("✅ O'quvchi qo‘shildi! | Ученик успешно добавлен!", {
        style: { fontSize: "18px" },
      });

      setFullName("");
      setSubject("");
      setPhone("");
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error("❌ Xatolik yuz berdi! | Произошла ошибка!", {
        style: { fontSize: "18px" },
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[500px] w-full mx-auto p-10 bg-white shadow-2xl rounded-lg border border-gray-300 text-2xl flex flex-col gap-10"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Yangi O‘quvchi Qo‘shish
      </h2>

      <div className="mb-4">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ism Familiya"
          className="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Fan tanlang</option>
          <optgroup label="Tilllar">
            <option value="Koreys tili">Koreys tili</option>
            <option value="Ingliz tili">Ingliz tili</option>
            <option value="Arab tili">Arab tili</option>
            <option value="Nemis tili">Nemis tili</option>
          </optgroup>
          <optgroup label="Matematika va Fanlar">
            <option value="Matematika">Matematika</option>
            <option value="Biologiya">Biologiya</option>
          </optgroup>
          <optgroup label="Kompyuter kurslari">
            <option value="Kompyuter savodxonligi">Kompyuter savodxonligi</option>
            <option value="Frontend">Front End</option>
            <option value="Backend">Back End</option>
          </optgroup>
          <optgroup label="Maxsus guruhlar">
            <option value="Ingliz tili KIDS">Ingliz tili KIDS</option>
          </optgroup>
        </select>
      </div>

      <div className="mb-6">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefon raqami"
          className="w-full border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Qo‘shish
      </button>
    </form>
  );
};

export default AddStudent;
