import React, { useState } from "react";
import {
  View,
  Text,
  Avatar,
  Card,
  Colors,
  ActionSheet,
} from "react-native-ui-lib";
import { TouchableOpacity, ScrollView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import EditProfileModal from "@/components/EditProfileModal";
import FriendListModal from "@/components/FriendListModal";
import { PaperProvider } from "react-native-paper";

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [friendListModalVisible, setFriendListModalVisible] = useState(false);
  const translateY = useSharedValue(0); // Khởi tạo giá trị animation
  const [name, setName] = useState("채수빈");
  const [email, setEmail] = useState("csb@gmail.com");
  const [phone, setPhone] = useState("4060001290");
  const [selectedField, setSelectedField] = useState("Edit name");
  const [profilePic, setProfilePic] = useState(
    require("@/assets/images/alligator.jpg"),
  );
  const [friendList, setFriendList] = useState([
    { id: 1, name: "John Doe", avatar: require("@/assets/images/capy.jpg") },
    { id: 2, name: "Jane Smith", avatar: require("@/assets/images/corgi.jpg") },
    {
      id: 3,
      name: "Alice Johnson",
      avatar: require("@/assets/images/pig.jpg"),
    },
    { id: 4, name: "John Doe", avatar: require("@/assets/images/capy.jpg") },
    { id: 5, name: "Jane Smith", avatar: require("@/assets/images/corgi.jpg") },
    {
      id: 6,
      name: "Alice Johnson",
      avatar: require("@/assets/images/pig.jpg"),
    },
  ]);

  // Mở album ảnh
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri });
    }
  };

  // Mở camera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri });
    }
  };

  const openActionSheet = () => {
    setShowActionSheet(true);
  };

  const handleSave = (value, field) => {
    field.includes("name")
      ? setName(value)
      : field.includes("phone")
        ? setPhone(value)
        : setEmail(value);
    closeModal();
  };

  const openModal = (field) => {
    setSelectedField(field);
    setModalVisible(true);
    translateY.value = withTiming(0, { duration: 200 }); // Hiển thị modal từ dưới lên
  };

  const closeModal = () => {
    translateY.value = withTiming(800, { duration: 100 }); // Kéo xuống để ẩn modal
    setTimeout(() => setModalVisible(false), 100);
  };

  const openFriendListModal = () => {
    setFriendListModalVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  };

  const closeFriendListModal = () => {
    translateY.value = withTiming(800, { duration: 100 });
    setTimeout(() => setFriendListModalVisible(false), 100);
  };

  return (
    <PaperProvider>
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: Colors.grey80, paddingTop: 30 }}
      >
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Avatar and name */}
          <View center>
            <TouchableOpacity
              onPress={openActionSheet}
              style={{
                borderWidth: 5,
                borderColor: "green",
                borderRadius: 100,
                padding: 3,
              }}
            >
              <Avatar size={120} source={profilePic} />
            </TouchableOpacity>
            <Text text50 marginT-10>
              {name}
            </Text>
          </View>

          {/* Friendlist */}
          <View row centerV gap-5 marginB-10>
            <Ionicons name="person-add" size={25} color="black" />
            <Text>Friend</Text>
          </View>
          <Card
            marginB-25
            padding-15
            borderRadius={10}
            style={{ backgroundColor: Colors.white }}
          >
            <TouchableOpacity onPress={openFriendListModal}>
              <View row spread paddingV-10 centerV>
                <View row center gap-10>
                  <View bg-black br100 width={36} height={36} center>
                    <Ionicons name="people" size={20} color="white" />
                  </View>
                  <Text>{friendList.length} Friends</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="black"
                />
              </View>
            </TouchableOpacity>
          </Card>

          {/* Personal Information */}
          <View row centerV gap-5 marginB-10>
            <Ionicons name="settings" size={25} color="black" />
            <Text text70>General</Text>
          </View>
          <Card
            padding-15
            marginB-25
            borderRadius={10}
            style={{ backgroundColor: Colors.white }}
          >
            {[
              { title: "Edit profile picture", icon: "camera-outline" },
              { title: "Edit name", icon: "pencil" },
              { title: "Edit phone number", icon: "call-outline" },
              { title: "Edit email", icon: "mail-outline" },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={
                  item.title.includes("picture")
                    ? openActionSheet
                    : () => openModal(item.title)
                }
              >
                <View row spread paddingV-10>
                  <View row center gap-10>
                    <View bg-black br100 width={36} height={36} center>
                      <Ionicons name={item.icon} size={20} color="white" />
                    </View>
                    <Text>{item.title}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </Card>

          {/* Danger Zone */}
          <View row centerV marginB-10 gap-5>
            <Ionicons name="alert-circle-outline" size={25} color="red" />
            <Text text70 color={Colors.red30}>
              Danger Zone
            </Text>
          </View>
          <Card
            padding-15
            marginB-25
            borderRadius={10}
            style={{ backgroundColor: Colors.white }}
          >
            {[
              { title: "Delete account", icon: "trash-outline" },
              { title: "Log out", icon: "log-out-outline" },
            ].map((item, index) => (
              <TouchableOpacity key={index} onPress={() => alert(item.title)}>
                <View row spread paddingV-10>
                  <View row center gap-10>
                    <View bg-black br100 width={36} height={36} center>
                      <Ionicons name={item.icon} size={20} color="white" />
                    </View>
                    <Text>{item.title}</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        </ScrollView>

        {/* Popup modal */}
        <EditProfileModal
          translateY={translateY}
          value={
            selectedField === "Edit name"
              ? name
              : selectedField === "Edit phone number"
                ? phone
                : email
          }
          visible={modalVisible}
          field={selectedField}
          onSave={handleSave}
          closeModal={closeModal}
        />

        {/* Friend list modal */}
        <FriendListModal
          translateY={translateY}
          visible={friendListModalVisible}
          closeModal={closeFriendListModal}
          friendList={friendList}
          onUpdateFriendList={setFriendList}
        />

        <ActionSheet
          visible={showActionSheet}
          onDismiss={() => setShowActionSheet(false)}
          useNativeIOS={Platform.OS === "ios" ? true : false}
          options={[
            { label: "Take Photo", onPress: takePhoto },
            { label: "Choose from Library", onPress: pickImage },
            {
              label: "Cancel",
              onPress: () => setShowActionSheet(false),
              cancel: true,
            },
          ]}
        />
      </GestureHandlerRootView>
      <StatusBar style="dark" />
    </PaperProvider>
  );
};
export default ProfileScreen;
