import React, { useState } from "react";
import {
  View,
  Text,
  Card,
  Colors,
  ActionSheet,
  Button,
  Image,
} from "react-native-ui-lib";
import { TouchableOpacity, ScrollView, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import EditProfileModal from "./components/EditProfileModal";
import FriendListModal from "./components/FriendListModal";
import { PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";
import { set } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

interface Friend {
  id: number;
  name: string;
  avatar: string;
}

interface SettingSection {
  title: string;
  icon:
    | "camera-outline"
    | "pencil"
    | "call-outline"
    | "mail-outline"
    | "trash-outline"
    | "log-out-outline"
    | "color-palette-outline";
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const generalSection: SettingSection[] = [
    {
      title: "Edit profile picture",
      icon: "camera-outline",
    },
    { title: "Edit name", icon: "pencil" },
    { title: "Edit phone number", icon: "call-outline" },
    { title: "Edit email", icon: "mail-outline" },
  ];
  const dangerSection: SettingSection[] = [
    { title: "Change theme", icon: "color-palette-outline" },
    { title: "Delete account", icon: "trash-outline" },
    { title: "Log out", icon: "log-out-outline" },
  ];
  const { setTheme } = useThemeStore();
  const { setLanguage } = useThemeStore();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [friendListModalVisible, setFriendListModalVisible] =
    useState<boolean>(false);
  const [name, setName] = useState<string>("Đặng Nhật Beo");
  const [email, setEmail] = useState<string>("csb@gmail.com");
  const [phone, setPhone] = useState<string>("4060001290");
  const [selectedField, setSelectedField] = useState<string>("Edit name");
  const [profilePic, setProfilePic] = useState(
    require("@/assets/images/alligator.jpg"),
  );
  // const [friendList, setFriendList] = useState<Friend[]>([
  //   { id: 1, name: "John Doe", avatar: require("@/assets/images/capy.jpg") },
  //   { id: 2, name: "Jane Smith", avatar: require("@/assets/images/corgi.jpg") },
  //   {
  //     id: 3,
  //     name: "Alice Johnson",
  //     avatar: require("@/assets/images/pig.jpg"),
  //   },
  //   { id: 4, name: "John Doe", avatar: require("@/assets/images/capy.jpg") },
  //   { id: 5, name: "Jane Smith", avatar: require("@/assets/images/corgi.jpg") },
  //   {
  //     id: 6,
  //     name: "Alice Johnson",
  //     avatar: require("@/assets/images/pig.jpg"),
  //   },
  // ]);

  const fetchFriends = async (): Promise<Friend[]> => {
    const response = await fetch("http://localhost:3000/api/v1/friends");
    if (!response.ok) throw new Error("Failed to fetch friends");
    return response.json();
  };

  const {
    data: friendList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

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

  const handleSave = (value: string, field: string) => {
    field.includes("name")
      ? setName(value)
      : field.includes("phone")
        ? setPhone(value)
        : setEmail(value);
    closeModal();
  };

  const openModal = (field: string) => {
    setSelectedField(field);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openFriendListModal = () => {
    setFriendListModalVisible(true);
  };

  const closeFriendListModal = () => {
    setFriendListModalVisible(false);
  };

  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#EEF8EF" }}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30 }}
        >
          {/* Avatar and Personal Information */}
          <View center>
            <View center marginB-60 style={{ position: "relative" }}>
              <Image
                source={profilePic}
                style={{
                  width: Dimensions.get("window").width - 30,
                  height: Dimensions.get("window").width - 30,
                  borderRadius: 20,
                  borderWidth: 4,
                  borderColor: "#3F6453",
                  resizeMode: "cover",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                  transform: [{ translateY: 40 }],
                  backgroundColor: "#3F6453",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  marginHorizontal: 20,
                  borderRadius: 10,
                }}
              >
                <Text text50 marginT-10 color="white">
                  {name}
                </Text>
                <View
                  row
                  style={{ alignItems: "baseline", justifyContent: "center" }}
                >
                  <Text text70 color="white">
                    {" "}
                    {phone}{" "}
                  </Text>
                  <Text color="white"> - </Text>
                  <Text text70 color="white">
                    {" "}
                    {email}{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            marginT-10
            marginB-25
            paddingV-10
            row
            backgroundColor="white"
            style={{ borderWidth: 1, borderRadius: 10, overflow: "hidden" }}
          >
            <View flex center padding-10 style={{ borderRightWidth: 1 }}>
              <Text text70>Number of Trips</Text>
              <Text text50BO>70</Text>
              <Button
                label="Go to My trips"
                backgroundColor="#3F6453"
                onPress={() => navigation.navigate("my-trips")}
              />
            </View>

            <View flex center padding-10>
              <Text text70>Completed Trips</Text>
              <Text text50BO>50</Text>
              <Button label="View Trip history" backgroundColor="#3F6453" />
            </View>
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
            style={{
              backgroundColor:
                isError || isLoading ? Colors.grey60 : Colors.white,
            }}
          >
            <TouchableOpacity
              onPress={openFriendListModal}
              disabled={isLoading || isError}
            >
              <View row spread paddingV-10 centerV>
                <View row center gap-10>
                  <View
                    style={{ backgroundColor: "#3F6453" }}
                    br100
                    width={36}
                    height={36}
                    center
                  >
                    <Ionicons name="people" size={20} color="white" />
                  </View>
                  {isLoading ? (
                    <Text>Loading friends...</Text>
                  ) : isError ? (
                    <Text>Error loading friends</Text>
                  ) : (
                    <Text>{friendList.length} Friends</Text>
                  )}
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
            {generalSection.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={
                  item.title.includes("picture")
                    ? openActionSheet
                    : () => openModal(item.title)
                }
              >
                <View row spread paddingV-10 centerV>
                  <View row center gap-10>
                    <View
                      style={{ backgroundColor: "#3F6453" }}
                      br100
                      width={36}
                      height={36}
                      center
                    >
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
            {dangerSection.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setTheme("dark");
                  setLanguage("vi");
                }}
              >
                <View row spread paddingV-10 centerV>
                  <View row center gap-10>
                    <View
                      style={{ backgroundColor: "#3F6453" }}
                      br100
                      width={36}
                      height={36}
                      center
                    >
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
          visible={friendListModalVisible}
          closeModal={closeFriendListModal}
          friendList={friendList}
          //onUpdateFriendList={setFriendList}
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
