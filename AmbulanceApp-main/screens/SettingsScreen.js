import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import colors from "../colors";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, update } from "firebase/database";
import { auth, db } from "../database/firebase";

const profileImage = require("../images/profile_icon.png");
const backImage = require("../images/orange_bck.jpeg");

const UserInfoField = ({ iconName, info, editable, value, onChangeText }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    setIsEditing(false);
  };
  return (
    <View style={styles.information_container}>
      <FontAwesome name={iconName} style={styles.icon} size={20} />
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          autoFocus
        />
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.info}>{info}</Text>
          {editable && (
            <TouchableOpacity onPress={handleEditPress}>
              <FontAwesome name="pencil" style={styles.editIcon} size={20} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {isEditing && (
        <TouchableOpacity onPress={handleSavePress}>
          <FontAwesome name="check" style={styles.saveIcon} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [ambulanceNumber, setAmbulanceNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("");

  // For edit
  const [newCity, setNewCity] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newHospital, setNewHospital] = useState("");
  const [newAmbulanceNumber, setNewAmbulanceNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FontAwesome
          name="chevron-left"
          size={24}
          color={colors.gray}
          style={{ marginLeft: 15 }}
          onPress={() => navigation.goBack()}
        ></FontAwesome>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        // Retrieve username
        const usernameRef = ref(db, `users/${uid}/username`);
        onValue(usernameRef, (snapshot) => {
          const usernameValue = snapshot.val();
          setUsername(usernameValue);
        });

        // Retrieve password
        const passwordRef = ref(db, `users/${uid}/password`);
        onValue(passwordRef, (snapshot) => {
          const passwordValue = snapshot.val();
          setPassword(passwordValue);
        });

        // Retrieve city
        const cityRef = ref(db, `users/${uid}/city`);
        onValue(cityRef, (snapshot) => {
          const cityValue = snapshot.val();
          setCity(cityValue);
        });

        // Retrieve phone
        const phoneRef = ref(db, `users/${uid}/phoneNumber`);
        onValue(phoneRef, (snapshot) => {
          const phoneValue = snapshot.val();
          setPhoneNumber(phoneValue);
        });

        // Retrieve ambulanceNumber
        const ambulanceNumberRef = ref(db, `users/${uid}/ambulanceNumber`);
        onValue(ambulanceNumberRef, (snapshot) => {
          const ambulanceNumberValue = snapshot.val();
          setAmbulanceNumber(ambulanceNumberValue);
        });

        // Retrieve hospital
        const hospitalRef = ref(db, `users/${uid}/hospital`);
        onValue(hospitalRef, (snapshot) => {
          const hospitalValue = snapshot.val();
          setHospital(hospitalValue);
        });

        // Retrieve fullName
        const fullNameRef = ref(db, `users/${uid}/fullName`);
        onValue(fullNameRef, (snapshot) => {
          const fullNameValue = snapshot.val();
          setFullName(fullNameValue);
        });

        // Retrieve status
        const statusRef = ref(db, `users/${uid}/status`);
        onValue(statusRef, (snapshot) => {
          const statusValue = snapshot.val();
          setStatus(statusValue);
        });
      }
    });

    return () => {
      // Clean up the subscription when the component unmounts
      unsubscribe();
    };
  }, []);

  const handleEditProfile = () => {
    const uid = auth.currentUser?.uid;

    if (uid) {
      const userRef = ref(db, `users/${uid}`);

      const updates = {};

      // Update the fields based on the user's input
      if (newUsername) {
        updates.username = newUsername;
      }
      if (newCity) {
        updates.city = newCity;
      }
      if (newPhoneNumber) {
        updates.phoneNumber = newPhoneNumber;
      }
      if (newHospital) {
        updates.hospital = newHospital;
      }
      if (newAmbulanceNumber) {
        updates.ambulanceNumber = newAmbulanceNumber;
      }

      if (newFullName) {
        updates.fullName = newFullName;
      }
      if (newStatus) {
        updates.status = newStatus;
      }

      update(userRef, updates)
        .then(() => {
          console.log("Profile updated successfully!");
          // Show a success message to the user
        })
        .catch((error) => {
          console.log("Error updating profile:", error);
          // Show an error message to the user
        });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />

      <View style={styles.icon_container}>
        <FontAwesome name="user" style={styles.profileImage} size={65} />
        <Text style={styles.title}>{auth.currentUser?.email}</Text>
      </View>

      <View style={styles.whiteSheet}>
        <View style={styles.info_details}>
          <UserInfoField
            iconName="user"
            info={fullName}
            editable={true}
            value={newFullName}
            onChangeText={(text) => setNewFullName(text)}
          />
          <UserInfoField
            iconName="user-circle"
            info={username}
            editable={true}
            value={newUsername}
            onChangeText={(text) => setNewUsername(text)}
          />

          <UserInfoField
            iconName="phone"
            info={phoneNumber}
            editable={true}
            value={newPhoneNumber}
            onChangeText={(text) => setNewPhoneNumber(text)}
          />
          <UserInfoField
            iconName="map-marker"
            info={city}
            editable={true}
            value={newPhoneNumber}
            onChangeText={(text) => setNewPhoneNumber(text)}
          />
          <UserInfoField
            iconName="hospital-o"
            info={hospital}
            editable={true}
            value={newHospital}
            onChangeText={(text) => setNewHospital(text)}
          />
          <UserInfoField
            iconName="hashtag"
            info={`Ambulance Nr. : ${ambulanceNumber}`}
            editable={true}
            value={newAmbulanceNumber}
            onChangeText={(text) => setNewAmbulanceNumber(text)}
          />
          <UserInfoField
            iconName="check-circle"
            info={`Status : ${status}`}
            editable={true}
            value={newStatus}
            onChangeText={(text) => setNewStatus(text)}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: 18,
                margin: 15,
              }}
            >
              {" "}
              Edit
            </Text>
          </TouchableOpacity>
          <Text style={styles.changePass}>
            Change Password? Click{" "}
            <Text
              onPress={() => navigation.navigate("Change Password")}
              style={{ color: "orange" }}
            >
              here
            </Text>{" "}
          </Text>
          <Text style={styles.changePass}>
            Delete profile? Click{" "}
            <Text
              onPress={() => navigation.navigate("Delete Account")}
              style={{ color: "orange" }}
            >
              here
            </Text>{" "}
          </Text>
        </View>
      </View>
      {/* <Text style={styles.title}>hello</Text> */}
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
    paddingBottom: 24,
  },
  backImage: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    height: 500,
  },

  profileImage: {
    backgroundColor: "#fff",
    width: 75,
    height: 75,
    borderRadius: "38%",
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 100,
    verticalAlign: "middle",
    borderColor: "black",
    borderWidth: 1.5,
  },

  icon_container: {
    position: "absolute",
    top: "3%",
    alignSelf: "center",
    alignContent: "center",
    textAlign: "center",
    alignItems: "center",
  },

  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    borderColor: "rgb(241 245 249)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  information_container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    margin: 5,
  },
  icon: {
    marginRight: 10,
    width: 20,
    height: 20,
    marginRight: 25,
  },
  info: {
    fontSize: 20,
  },
  info_details: {
    flex: 1,
    padding: 25,
    paddingBottom: 10,
    alignItems: "left",
    justifyContent: "center",
  },
  button: {
    paddingHorizontal: 20,
    backgroundColor: "#f57c00",
    height: 58,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  editIcon: {
    marginLeft: 10,
    color: "#888",
  },
  saveIcon: {
    marginLeft: 10,
    color: "#0a0",
  },

  changePass: {
    color: "#888",
    fontSize: 16,
    marginTop: 10,
  },
});
