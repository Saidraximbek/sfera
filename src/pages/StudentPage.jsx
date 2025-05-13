import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { addPayment, updatePayment, deletePayment } from "../components/PaymentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const monthsList = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"
];

const StudentPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ month: "", year: "", amount: "" });
  const [editPayment, setEditPayment] = useState({ month: "", year: "", amount: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const fetchStudent = async () => {
    try {
      const studentRef = doc(db, "confirmedStudents", id);
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        setStudent(studentSnap.data());
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const paymentsRef = doc(db, "payments", id);
      const paymentsSnap = await getDoc(paymentsRef);
      if (paymentsSnap.exists()) {
        setPayments(paymentsSnap.data().payments);
      }
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  const handleAddPayment = async () => {
    const { month, year, amount } = newPayment;
    if (month && year && amount) {
      await addPayment(id, month, year, parseInt(amount.replace(/,/g, "")));
      setNewPayment({ month: "", year: "", amount: "" });
      fetchPayments();
      toast.success("To'lov qo'shildi!", { style: { fontSize: "16px" } });
    } else {
      toast.error("Barcha maydonlarni to'ldiring!", { style: { fontSize: "16px" } });
    }
  };

  const handleEditPayment = async () => {
    const { month, year, amount } = editPayment;
    if (month && year && amount) {
      await updatePayment(id, month, year, parseInt(amount.replace(/,/g, "")));
      fetchPayments();
      setEditPayment({ month: "", year: "", amount: "" });
      setIsEditing(false);
      toast.success("To'lov tahrirlandi!", { style: { fontSize: "16px" } });
    } else {
      toast.error("Barcha maydonlarni to'ldiring!", { style: { fontSize: "16px" } });
    }
  };

  const handleEditButtonClick = (payment) => {
    setEditPayment({
      ...payment,
      amount: payment.amount.toLocaleString()
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (paymentToDelete) {
      await deletePayment(id, paymentToDelete.month, paymentToDelete.year);
      fetchPayments();
      setShowDeleteModal(false);
      toast.success("To'lov o'chirildi!", { style: { fontSize: "16px" } });
    }
  };

  const handleAmountChange = (value, isEdit = false) => {
    const raw = value.replace(/[^\d]/g, "");
    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    isEdit
      ? setEditPayment({ ...editPayment, amount: formatted })
      : setNewPayment({ ...newPayment, amount: formatted });
  };

  useEffect(() => {
    fetchStudent();
    fetchPayments();
  }, [id]);

  if (!student) return <div className="text-center text-xl">Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">O'quvchi ma'lumotlari</h2>

      <div className="space-y-4 text-lg text-gray-700">
        <p className="text-2xl"><strong className="text-xl">Ism Familiya:</strong> {student.fullName}</p>
        <p className="text-2xl"><strong className="text-xl">Fan:</strong> {student.subject}</p>
        <p className="text-2xl"><strong className="text-xl">Telefon:</strong> {student.phone}</p>
        <p className="text-2xl"><strong className="text-xl">O'qituvchi:</strong> {student.teacher}</p>
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 mt-8">To'lovlar</h3>
      <ul className="space-y-4 mt-4">
        {payments.map((payment, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
            <div>
              <span className="font-bold text-xl">{payment.month} {payment.year}:</span>
              <p className="text-xl font-bold">{payment.amount.toLocaleString()} so'm  {payment.paid ? <p className="text-green-600">To'langan</p> : <p className="text-red-800">To'lanmagan</p>}</p>
              {payment.date && (
                <p className="text-xl font-medium text-gray-500">
                  To'lov sanasi: {new Date(payment.date.seconds * 1000).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditButtonClick(payment)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
              >
                Tahrirlash
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Yangi to'lov qo'shish */}
      <div className="mt-8 border-t pt-6">
        <h4 className="text-xl font-semibold">Yangi to'lov qo'shish</h4>
        <div className="space-y-4">
          <select
            value={newPayment.month}
            onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 w-full text-xl"
          >
            <option value="">Oy tanlang</option>
            {monthsList.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Yil"
            value={newPayment.year}
            onChange={(e) => setNewPayment({ ...newPayment, year: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 w-full text-xl"
          />
          <input
            type="text"
            placeholder="Miqdori"
            value={newPayment.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full text-xl"
          />
          <button
            onClick={handleAddPayment}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
          >
            To'lov qo'shish
          </button>
        </div>
      </div>

      {/* To'lovni tahrirlash */}
      {isEditing && (
        <div className="mt-8 border-t pt-6">
          <h4 className="text-xl font-semibold">To'lovni tahrirlash</h4>
          <div className="space-y-4">
            <select
              value={editPayment.month}
              onChange={(e) => setEditPayment({ ...editPayment, month: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full text-xl"
            >
              <option value="">Oy tanlang</option>
              {monthsList.map((m, idx) => (
                <option key={idx} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Yil"
              value={editPayment.year}
              onChange={(e) => setEditPayment({ ...editPayment, year: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full text-xl"
            />
            <input
              type="text"
              placeholder="Miqdori"
              value={editPayment.amount}
              onChange={(e) => handleAmountChange(e.target.value, true)}
              className="border border-gray-300 rounded-lg p-3 w-full text-xl"
            />
            <button
              onClick={handleEditPayment}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              Tahrirlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
