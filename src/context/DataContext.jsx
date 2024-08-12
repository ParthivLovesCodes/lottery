import React, { createContext, useContext } from "react";
import { firestore } from "../config/firebase-config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const createDayDoc = async (dayId) => {
    try {
      const timesCollectionRef = collection(
        firestore,
        "results",
        dayId,
        "times"
      );
      const q = query(timesCollectionRef, limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.log("Document already exists, skipping creation.");
        return { success: false, message: "Data Already Created!" };
      }
      const startHour = 9;
      const endHour = 21;
      const intervalMinutes = 15;

      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
          if (hour === endHour && minute > 0) {
            break;
          }
          const formattedHour = `${hour % 12 || 12}`.padStart(2, "0");
          const formattedMinute = `${minute}`.padStart(2, "0");
          const period = hour < 12 || hour === 24 ? "AM" : "PM";
          const time = `${formattedHour}:${formattedMinute} ${period}`;

          const timeData = {
            time: time,
            declared: false,
            "1_": "00",
            "2_": "00",
            "3_": "00",
            createdAt: Timestamp.now(),
          };

          await addDoc(timesCollectionRef, timeData);
        }
      }
      console.log("All time slots successfully created!");
      return { success: true, message: "Success" };
    } catch (error) {
      console.error("Error creating subdocuments: ", error);
      return { success: false, message: "Error Creating Data!" };
    }
  };

  const convertTimeToMinutes = (time) => {
    const [timeString, period] = time.split(" ");
    let [hours, minutes] = timeString.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const getResultsByDate = async (dayId) => {
    try {
      const timesCollectionRef = collection(
        firestore,
        "results",
        dayId,
        "times"
      );

      const q = query(timesCollectionRef);

      const querySnapshot = await getDocs(q);
      const results = [];

      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      results.sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time);
        const timeB = convertTimeToMinutes(b.time);

        return timeA - timeB;
      });

      if (results.length === 0) return { error: "Not Found!" };

      return { data: results };
    } catch (error) {
      console.error("Error fetching results: ", error);
      return { error: "Not Found!" };
    }
  };

  const getResultByDateTime = async (date, timeId) => {
    try {
      const docRef = doc(firestore, "results", date, "times", timeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { data: docSnap.data() };
      } else {
        return { error: "No such document!" };
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
      return { error: "Error fetching document: " + error.message };
    }
  };

  const updateResultByDateTime = async (date, timeId, updateData) => {
    try {
      const docRef = doc(firestore, "results", date, "times", timeId);
      await updateDoc(docRef, updateData);
      return { success: true };
    } catch (error) {
      console.error("Error updating document: ", error);
      return { error: "Error updating document: " + error.message };
    }
  };

  return (
    <DataContext.Provider
      value={{
        getResultsByDate,
        getResultByDateTime,
        createDayDoc,
        updateResultByDateTime,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
