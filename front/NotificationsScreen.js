import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import { NotificationService } from "../back/NotificationsService";
import { useNavigation } from "@react-navigation/core";
import myLogoPic from "../assets/default.png";
import NotificationCard from "../components/NotificationCard";
import { AntDesign } from "@expo/vector-icons";
import { stylesNotifi } from "../components/StylesSheets";

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestNotification, setLatestNotification] = useState(null);
  const slideAnim = useRef(new Animated.Value(-100)).current; // Initial position off-screen

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userNotifications =
          await NotificationService.getUserNotifications();
        if (userNotifications && userNotifications.length > 0) {
          setNotifications(userNotifications);
        } else {
          console.log("No Notifications found for the given criteria.");
        }
      } catch (error) {
        console.error("Error fetching Notifications:", error);
      } finally {
        setIsLoading(false); // This ensures isLoading is set to false after fetching is done
      }
    };

    fetchNotifications();
  }, []);

  const pressedNotification = (notification) => {
    if (
      notification.Type === "Request accepted" ||
      notification.Type === "New Meeting"
    ) {
      try {
        navigation.navigate("Home", { screen: "My Groups" });
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const backButton = () => {
    try {
      navigation.replace("Home");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={myLogoPic} style={stylesNotifi.backgroundImage}>
        <View style={stylesNotifi.container}>
          <TouchableOpacity
            onPress={backButton}
            style={stylesNotifi.backButton}
          >
            <AntDesign name="back" size={30} color="black" />
          </TouchableOpacity>
          <ScrollView>
            {isLoading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <View style={stylesNotifi.container}>
                {notifications
                  .slice()
                  .reverse()
                  .map((notification) => (
                    <TouchableOpacity
                      key={notification.id}
                      onPress={() => pressedNotification(notification)}
                    >
                      <NotificationCard notification={notification} />
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

// Styles for the NotificationsScreen

// export { pressedNotification };
export default NotificationsScreen;
