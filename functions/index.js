import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import functions from "firebase-functions";
import moment from "moment-timezone";

initializeApp({
  credential: applicationDefault(),
});

const db = getFirestore();

const timeZone = "Asia/Kolkata";

export const scheduledFunction = functions.pubsub
  .schedule("1,31 * * * *")
  .timeZone(timeZone)
  .onRun(async (context) => {
    const now = moment().tz(timeZone);

    const oneMinuteBefore = now.clone().subtract(1, "minute");
    const formattedDate = oneMinuteBefore.format("DD-MM-YYYY");
    const formattedTime = oneMinuteBefore.format("hh:mm A");

    try {
      const docRef = db.collection("results").doc(formattedDate);
      const docSnapshot = await docRef.get();

      if (!docSnapshot.exists) {
        console.log(`No document found with ID: ${formattedDate}`);
        return;
      }

      const timesCollectionRef = docRef.collection("times");
      const querySnapshot = await timesCollectionRef
        .where("time", "==", formattedTime)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        console.log(
          `No matching documents found in subcollection with time: ${formattedTime}`
        );
      } else {
        const firstDoc = querySnapshot.docs[0];
        console.log(
          `Found document in 'times': ${firstDoc.id} =>`,
          firstDoc.data()
        );
        const docData = firstDoc.data();
        if (docData && docData.declared === false) {
          const randomNumbers = Array.from({ length: 3 }, () =>
            Math.floor(Math.random() * 100)
          );

          const updateData = {
            "1_": randomNumbers[0].toString().padStart(2, "0"),
            "2_": randomNumbers[1].toString().padStart(2, "0"),
            "3_": randomNumbers[2].toString().padStart(2, "0"),
            declared: true,
          };

          await firstDoc.ref.update(updateData);
          console.log(`Document updated with:`, updateData);
        } else if (docData && docData.declared !== undefined) {
          console.log(
            "The property `declared` is not false. It is:",
            docData.declared
          );
        } else {
          console.log(
            "The property `declared` is not present in the document."
          );
        }
      }
    } catch (error) {
      console.error("Error accessing Firestore:", error);
    }

    return null;
  });

// Create Day Doc:

// Helper function to create the document and time slots
const createDayDoc = async (dayId) => {
  try {
    const timesCollectionRef = db
      .collection("results")
      .doc(dayId)
      .collection("times");
    const resultsDocRef = db.collection("results").doc(dayId);
    const resultsDocSnapshot = await resultsDocRef.get();

    if (resultsDocSnapshot.exists) {
      console.log("Document already exists, skipping creation.");
      return;
    }

    await resultsDocRef.set({ createdAt: Timestamp.now() });

    const startHour = 9;
    const endHour = 21;
    const intervalMinutes = 30;

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

        await timesCollectionRef.add(timeData);
      }
    }

    console.log("All time slots successfully created!");
  } catch (error) {
    console.error("Error creating subdocuments: ", error);
  }
};

// Scheduler function to run at 7 AM and 8 AM
export const checkAndCreateDayDoc = functions.pubsub
  .schedule("0 7,8 * * *") // Runs at 7 AM and 8 AM daily
  .timeZone(timeZone)
  .onRun(async (context) => {
    const now = moment().tz(timeZone);
    const formattedDate = now.format("DD-MM-YYYY");

    try {
      await createDayDoc(formattedDate);
    } catch (error) {
      console.error("Error executing scheduled function:", error);
    }

    return null;
  });
