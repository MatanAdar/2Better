import { auth, db } from "../back/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

var userFirstName = "";
var userLastName = "";
var userCity = "";
var userAge = "";
var userGender = "";
var userNotificationCounter = 0;
var userImageUpload = 0;

export const UserService = {
  async createUserAccount(
    email,
    password,
    firstName,
    lastName,
    city,
    gender,
    age
  ) {
    try {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      const user = userCredentials.user;

      await db.collection("Users").doc(email).set({
        FirstName: firstName,
        LastName: lastName,
        City: city,
        Gender: gender,
        Age: age,
        Email: email,
        ImageUpload: 0,
        NotificationCounter: 0,
      });

      console.log("Registered with:", user.email);

      return true; // Indicate success
    } catch (error) {
      return false; // Indicate failure
    }
  },

  async getUserDetails() {
    try {
      // Check if the user is signed in
      if (auth.currentUser) {
        const userEmail = auth.currentUser.email;
        console.log("log in :", userEmail);
        // Ensure the email is not null or undefined
        if (userEmail) {
          const snapshot = await db.collection("Users").doc(userEmail).get();
          if (snapshot.exists) {
            const userData = snapshot.data();
            // Assuming these are global variables, but consider using setState or return the userData
            userFirstName = userData.FirstName;
            userLastName = userData.LastName;
            userCity = userData.City;
            userGender = userData.Gender;
            userAge = userData.Age;
            userImageUpload = userData.ImageUpload;
            userNotificationCounter = userData.NotificationCounter;
          } else {
            // Handle the case where the document does not exist
            console.log("No such document!");
          }
        } else {
          console.log("User email is null or undefined.");
        }
      } else {
        console.log("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  },

  async getUserNotificationCounter(userEmail = auth.currentUser.email) {
    try {
      const snapshot = await db.collection("Users").doc(userEmail).get();

      if (snapshot.exists) {
        const userData = snapshot.data();
        return userData.NotificationCounter;
      } else {
        // Handle the case where the document does not exist
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching User: ", error);
    }
  },
  async updateUserImage() {
    const userEmail = auth.currentUser.email;
    try {
      const userRef = db.collection("Users").doc(userEmail);
      userImageUpload = 1;
      await userRef.update({
        ImageUpload: 1,
      });

      userImageUpload = userRef.ImageUpload;
      console.log("User userImageUpload updated successfully");
    } catch (error) {
      console.error("Error updating user NotificationCounter: ", error);
    }
  },
  async updateUserNotificationCounter(
    counter = 0,
    userEmail = auth.currentUser.email
  ) {
    try {
      const userRef = db.collection("Users").doc(userEmail);

      // Update the user document
      await userRef.update({
        NotificationCounter: counter,
      });

      // console.log("User NotificationCounter updated successfully");
    } catch (error) {
      console.error("Error updating user NotificationCounter: ", error);
    }
  },

  // Update user details
  async updateUserDetails(firstName, lastName, city) {
    try {
      const userEmail = auth.currentUser.email;
      const userRef = db.collection("Users").doc(userEmail);

      // Update the user document
      await userRef.update({
        FirstName: firstName,
        LastName: lastName,
        City: city,
      });

      console.log("User details updated successfully");
    } catch (error) {
      console.error("Error updating user details: ", error);
    }
  },

  async deleteUserAccount() {
    try {
      const userEmail = auth.currentUser.email;

      // Delete the user document from the "Users" collection in Firestore
      await db.collection("Users").doc(userEmail).delete();

      // Delete the user account in Firebase Authentication
      await auth.currentUser.delete();

      console.log("User details deleted successfully");
    } catch (error) {
      console.error("Error deleting user details:", error);
      throw error; // Rethrow the error to be caught by the calling function
      // Handle the error accordingly
    }
  },
};

export {
  userFirstName,
  userLastName,
  userCity,
  userAge,
  userGender,
  userImageUpload,
};

export default UserService;
