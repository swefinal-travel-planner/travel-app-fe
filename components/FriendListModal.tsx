import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Colors,
  Modal,
  Card,
  Avatar,
  Button,
  TextField,
} from "react-native-ui-lib";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import {
  PanGestureHandler,
  ScrollView,
  State,
} from "react-native-gesture-handler";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Share } from "react-native";

const FriendListModal = ({
  translateY,
  visible,
  closeModal,
  friendList,
  onUpdateFriendList,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [visibleFriends, setVisibleFriends] = useState(3);
  const animatedHeight = useSharedValue(225);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [filteredFriendlist, setFilteredFriendlist] = useState(friendList);

  const shareText = async () => {
    try {
      const message = "Test sharing invitation from Trip 🚀";
      const url = "https://example.com";

      const shareOptions = Platform.select({
        ios: {
          message: `${message} ${url}`, // iOS cần gộp message + URL
        },
        android: {
          message,
          url, // Android hỗ trợ tách riêng
        },
      });
      await Share.share(shareOptions);
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  useEffect(() => {
    setIsSearching(false);
    setVisibleFriends(friendList.length > 3 ? 3 : friendList.length);
  }, [visible]);

  useEffect(() => {
    animatedHeight.value = withSpring(
      visibleFriends === 3
        ? 225
        : filteredFriendlist.length === 0
          ? 75
          : filteredFriendlist.length * 75,
      {
        damping: 100,
        stiffness: 120,
      },
    );
  }, [visibleFriends]);

  const confirmDeleteFriend = (friend) => {
    setSelectedFriend(friend);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteFriend = () => {
    if (selectedFriend) {
      const updatedList = friendList.filter(
        (friend) => friend.id !== selectedFriend.id,
      );

      // Cập nhật danh sách bạn bè trong state hoặc từ props
      setFilteredFriendlist(updatedList);
      onUpdateFriendList(updatedList);

      // Kiểm tra nếu visibleFriends đang hiển thị toàn bộ danh sách hoặc bị giảm xuống dưới 3
      const newVisibleFriends = Math.min(visibleFriends, updatedList.length);
      setVisibleFriends(newVisibleFriends);

      // Reset các state cần thiết
      setDeleteConfirmVisible(false);
      setSelectedFriend(null);
    }
  };

  const onGestureEvent = (event) => {
    translateY.value = event.nativeEvent.translationY;
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationY > 100) {
        closeModal();
      } else {
        translateY.value = withSpring(0);
      }
    }
  };

  // Animation đóng/mở modal
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Animation mở rộng input khi search
  const inputAnimatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isSearching ? 280 : 0, { damping: 15, stiffness: 120 }),
    opacity: withSpring(isSearching ? 1 : 0),
  }));

  // Animation mở rộng label khi đóng search
  const labelAnimatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isSearching ? 280 : 370, { damping: 15, stiffness: 120 }),
    opacity: withSpring(isSearching ? 0 : 1),
  }));

  // Animation mở rộng/thu gọn FriendList
  const animatedFriendListStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              {
                height: "95%",
                backgroundColor: Colors.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                marginTop: "auto",
              },
              animatedStyle,
            ]}
          >
            <View centerH marginV-10>
              <View
                style={{
                  width: 40,
                  height: 5,
                  backgroundColor: Colors.grey50,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              />
            </View>
            {!isSearching ? (
              <Animated.View
                style={[
                  {
                    alignSelf: "flex-start",
                    borderRadius: 20,
                    padding: 15,
                    width: "90%",
                    marginLeft: 20,
                    backgroundColor: "#f0f0f0",
                  },
                  labelAnimatedStyle,
                ]}
              >
                <TouchableOpacity onPress={() => setIsSearching(true)}>
                  <View row centerH>
                    <Ionicons name="search" size={25} />
                    <Text text60 marginL-10>
                      Add a new friend
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View row centerV spread paddingH-20>
                <Animated.View
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0",
                      padding: 15,
                      borderRadius: 60,
                    },
                    inputAnimatedStyle,
                  ]}
                >
                  <Ionicons name="search" size={25} color="black" />
                  <TextField
                    autoFocus
                    padding-5
                    marginH-5
                    marginR-10
                    keyboardType="default"
                    placeholder="Search or Add a new friend"
                  />
                </Animated.View>

                <Button
                  label="Cancel"
                  backgroundColor={Colors.white}
                  color="black"
                  labelStyle={{ fontWeight: "bold" }}
                  br50
                  onPress={() => setIsSearching(false)}
                />
              </View>
            )}

            <ScrollView style={{ padding: 20 }}>
              <View row centerV gap-5 marginT-20 marginB-10>
                <Ionicons name="people" size={25} color="black" />
                <Text text60>Your friends</Text>
              </View>
              <Card
                padding-15
                marginB-25
                borderRadius={10}
                style={{ backgroundColor: Colors.white }}
              >
                <Animated.View
                  style={[{ overflow: "hidden" }, animatedFriendListStyle]}
                >
                  {filteredFriendlist.length === 0 ? (
                    <View center style={{ height: "100%" }}>
                      <Text text70>
                        Share your request link to add new friend
                      </Text>
                    </View>
                  ) : (
                    filteredFriendlist
                      .slice(0, visibleFriends)
                      .map((friend, id) => (
                        <View key={id} row spread paddingV-10 centerV>
                          <View row center gap-10>
                            <View
                              style={{
                                borderWidth: 3,
                                borderColor: "green",
                                borderRadius: 100,
                                padding: 3,
                              }}
                            >
                              <Avatar size={40} source={friend.avatar} />
                            </View>
                            <Text text60>{friend.name}</Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => confirmDeleteFriend(friend)}
                          >
                            <Ionicons
                              name="close-outline"
                              size={25}
                              color="black"
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                  )}
                </Animated.View>
                {filteredFriendlist.length > 3 && (
                  <Button
                    label={visibleFriends === 3 ? "Show more" : "Show less"}
                    marginT-10
                    backgroundColor={
                      friendList.length < 4 ? Colors.grey5 : Colors.green5
                    }
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ width: "auto", alignSelf: "center" }}
                    disabled={friendList.length < 4}
                    onPress={() =>
                      setVisibleFriends(
                        visibleFriends === 3 ? friendList.length : 3,
                      )
                    }
                  />
                )}
              </Card>

              <View row centerV gap-5 marginT-20 marginB-10>
                <Ionicons name="paper-plane" size={25} color="black" />
                <Text text60>Share your request link</Text>
              </View>
              <Card
                padding-15
                marginB-25
                borderRadius={10}
                style={{ backgroundColor: Colors.white }}
              >
                {[
                  { name: "Share your request link", icon: "link" },
                  // { name: "Facebook", icon: "logo-facebook" },
                  // { name: "Instagram", icon: "logo-instagram" },
                  // { name: "LinkedIn", icon: "logo-linkedin" },
                  // { name: "Tiktok", icon: "logo-tiktok" },
                ].map((app, index) => (
                  <TouchableOpacity key={index} onPress={shareText}>
                    <View row spread centerV paddingV-10>
                      <View row center gap-10>
                        <View bg-black br100 width={50} height={50} center>
                          <Ionicons name={app.icon} size={30} color="white" />
                        </View>
                        <Text>{app.name}</Text>
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
          </Animated.View>
        </PanGestureHandler>
      </KeyboardAvoidingView>

      <Modal visible={deleteConfirmVisible} transparent animationType="fade">
        <View flex center style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Card
            padding-20
            width={300}
            center
            style={{ backgroundColor: "white", borderRadius: 10 }}
          >
            <Text text60>Remove Friend</Text>
            <Text marginV-10>
              Are you sure you want to remove{" "}
              <Text style={{ fontWeight: "bold" }}>{selectedFriend?.name}</Text>{" "}
              from your friends list?
            </Text>

            <View row spread gap-4>
              <Button
                label="Delete"
                backgroundColor="red"
                onPress={handleDeleteFriend}
              />
              <Button
                label="Cancel"
                onPress={() => setDeleteConfirmVisible(false)}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </Modal>
  );
};
export default FriendListModal;
