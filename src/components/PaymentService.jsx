import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";

export const addPayment = async (studentId, month, year, amount) => {
  try {
    const paymentRef = doc(db, "payments", studentId);
    const paymentSnap = await getDoc(paymentRef);

    const paymentDate = new Date();
    const newPayment = {
      month,
      year,
      amount,
      paid: true,
      date: { seconds: Math.floor(paymentDate.getTime() / 1000) } // To'g'ri formatlash
    };

    if (paymentSnap.exists()) {
      const data = paymentSnap.data();
      await updateDoc(paymentRef, {
        payments: arrayUnion(newPayment)
      });
    } else {
      await setDoc(paymentRef, {
        payments: [newPayment]
      });
    }
  } catch (error) {
    console.error("Add payment error:", error);
  }
};

export const updatePayment = async (studentId, month, year, newAmount) => {
  try {
    const paymentRef = doc(db, "payments", studentId);
    const paymentSnap = await getDoc(paymentRef);

    if (paymentSnap.exists()) {
      const data = paymentSnap.data();
      const updatedPayments = data.payments.map((payment) => {
        if (payment.month === month && payment.year === year) {
          return { ...payment, amount: newAmount };
        }
        return payment;
      });

      await setDoc(paymentRef, { ...data, payments: updatedPayments });
    }
  } catch (error) {
    console.error("Update payment error:", error);
  }
};

export const deletePayment = async (studentId, month, year) => {
  try {
    const paymentRef = doc(db, "payments", studentId);
    const paymentSnap = await getDoc(paymentRef);

    if (paymentSnap.exists()) {
      const data = paymentSnap.data();
      const filteredPayments = data.payments.filter(
        (payment) => !(payment.month === month && payment.year === year)
      );

      await setDoc(paymentRef, { ...data, payments: filteredPayments });
    }
  } catch (error) {
    console.error("Delete payment error:", error);
  }
};
