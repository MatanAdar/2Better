import {
  Pressable,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  AntDesign,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import CustomSlider from "./CustomSlider";
import {
  sportIconMapping_MaterialCommunityIcons,
  sportIconMapping_FontAwesome,
  sportIconMapping_FontAwesome5,
} from "../back/DataBase";
import { useNavigation } from "@react-navigation/core";
import NotificationService from "../back/NotificationsService";
import { auth } from "../back/firebase";
import React, { useEffect, useState } from "react";
import { userFirstName, userLastName, UserCity } from "../back/UserService";
import { serverTimestamp } from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

const ResultGroupCard = ({ group }) => {

  const navigation = useNavigation();
  const groupName = group?.GroupName ?? "Default Name";
  const currentParticipants = parseInt(group.Members, 10);
  const totalCapacity = parseInt(group.TotalCapacity, 10);
  // const userEmail = auth.currentUser.email;
  // const [isEditing, setIsEditing] = useState(false);
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const content = "`" + userFirstName + " " + userLastName + "` wants to join `" + groupName +"`"

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       setFirstName(userFirstName);
  //       setLastName(userLastName);
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   };

  //   fetchUserDetails();
  // }, []);

  const getSportIcon = (sportType) => {
    const iconName = sportIconMapping_FontAwesome5[sportType];
    if (iconName) {
      return <FontAwesome5 name={iconName} size={30} color="black" />;
    }
    const iconNameFA = sportIconMapping_FontAwesome[sportType];
    if (iconNameFA) {
      return <FontAwesome name={iconNameFA} size={30} color="black" />;
    }
    const iconNameMCI = sportIconMapping_MaterialCommunityIcons[sportType];
    if (iconNameMCI) {
      return (
        <MaterialCommunityIcons name={iconNameMCI} size={30} color="black" />
      );
    }

    return null; // Return null if no icon is found
  };

  const handleJoinPress = () =>{
    NotificationService.handleAddNewNotification(group.LeaderEmail, content, "Group joining request", serverTimestamp())
  };

  return (
    <SafeAreaView>
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          {getSportIcon(group.SportType)}
          <View>
            <Text style={styles.title}>{groupName}</Text>
            <Text style={styles.subTitle}>{group.SportType}</Text>
          </View>
        </View>
        <View style={styles.cardMiddleRow}>
          <View style={styles.iconAndTextContainer}>
            <MaterialIcons name="location-on" size={22} color="black" />
            <Text>{group.City}</Text>
          </View>
          <View style={styles.iconAndTextContainer}>
            <MaterialCommunityIcons name="email" size={22} color="black" />
            <Text>{group.LeaderEmail}</Text>
          </View>
        </View>
        <View style={styles.participantContainer}>
          <Text style={styles.participantText}>{currentParticipants}</Text>
          <CustomSlider
            minimumValue={0}
            maximumValue={totalCapacity}
            value={currentParticipants}
          />
          <Text style={styles.participantText}>{totalCapacity}</Text>
          <AntDesign name="user" size={22} color="black" />
        </View>
        <View style={styles.cardBottomRow}>
          <TouchableOpacity 
          style={styles.button}
          onPress={handleJoinPress}
          >
            <Text style={styles.buttonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResultGroupCard;

const styles = StyleSheet.create({
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  container: {
    backgroundColor: "#5B8BDF",
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 30,
    gap: 15,
    flex: 1,
  },
  card: {
    width: screenWidth - 32,
    marginTop: -30,
    backgroundColor: "#FFFFFF", // Assuming a white card background
    borderRadius: 15, // Rounded corners
    marginVertical: 8, // Adds vertical space between items
    marginHorizontal: 16, // Adds horizontal space and centers the card in the view
    padding: 16, // Internal spacing between the border and content
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 1 }, // Shadow position
    shadowOpacity: 0.22, // Shadow opacity
    shadowRadius: 2.22, // Shadow blur radius
    elevation: 3, // Elevation for Android
    borderWidth: 1, // Border width
    borderColor: "#E0E0E0",
  },
  cardTopRow: {
    marginTop: 0, // Adjust as needed to move closer to the top
    marginLeft: 0, // Adjust as needed for left alignment
    alignSelf: "flex-start", // Align self to the start of the cross axis
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  cardMiddleRow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  iconAndTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginLeft: 0,
  },
  sportIcon: {
    width: 30, // Adjust size as needed
    height: 30, // Adjust size as needed
    resizeMode: "contain",
    marginRight: 10, // Add some space between the icon and the text
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "flex-start",
    marginLeft: 0,
  },
  subTitle: {
    opacity: 0.6,
    alignSelf: "flex-start",
    marginLeft: 0,
    fontSize: 16,
    color: "gray",
  },
  button: {
    backgroundColor: "#3B82F6",
    width: 120,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    alignSelf: "center",
    color: "white",
  },
  participantContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    minimumTrackTintColor: "black",
    maximumTrackTintColor: "#C0C0C0", // Color for the remaining track
    thumbTintColor: "white",
  },
  participantText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    // Add margin to the left or right to space the text from the slider
    marginHorizontal: 5,
  },
});
