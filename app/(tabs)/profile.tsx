import React, { useState } from "react";
import { View, Text, Avatar, Button, Card, Colors, Modal, TextField } from "react-native-ui-lib";
import { TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActionSheetIOS } from "react-native";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const translateY = useSharedValue(0); // Khởi tạo giá trị animation
    const [name, setName] = useState("채수빈")

    const [profilePic, setProfilePic] = useState(require("@/assets/images/alligator.jpg"));

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

    // Hiển thị Action Sheet trên iOS
    const openActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Take Photo", "Choose from Library", "Cancel"],
                cancelButtonIndex: 2,
                title: "Change your profile picture",
                message: "Your profile picture is visible to all your friends",
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    takePhoto(); // Chụp ảnh
                } else if (buttonIndex === 1) {
                    pickImage(); // Chọn ảnh từ thư viện
                }
            }
        );
    };

    const openModal = () => {
        setModalVisible(true);
        translateY.value = withTiming(0, { duration: 200 }); // Hiển thị modal từ dưới lên
    };

    const closeModal = () => {
        translateY.value = withTiming(800, { duration: 100 }); // Kéo xuống để ẩn modal
        setTimeout(() => setModalVisible(false), 100);
    };

    // Cập nhật `translateY` khi người dùng kéo modal
    const onGestureEvent = (event) => {
        translateY.value = event.nativeEvent.translationY;
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            if (event.nativeEvent.translationY > 100) {
                closeModal(); // Nếu kéo xuống quá 100px, đóng modal
            } else {
                translateY.value = withSpring(0); // Nếu kéo nhẹ, trả modal về vị trí cũ
            }
        }
    };

    // Tạo animation cho modal
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.grey80, paddingTop: 30 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View center>
                    <TouchableOpacity onPress={() => openActionSheet()} style={{ borderWidth: 5, borderColor: "green", borderRadius: 100, padding: 3 }}>
                        <Avatar size={120} source={require("@/assets/images/alligator.jpg")} />
                    </TouchableOpacity>
                    <Text text50 marginT-10>{name}</Text>
                </View>

                {/* Friendlist */}
                <View row centerV gap-5 marginB-10>
                    <Ionicons name="person-add" size={20} color="black" />
                    <Text>Friend</Text>
                </View>
                <Card marginB-25 padding-15 borderRadius={10} style={{ backgroundColor: Colors.white }}>
                    <TouchableOpacity onPress={() => openModal()}>
                        <View row spread paddingV-10 centerV>
                            <View row center gap-10>
                                <View bg-black br100 width={36} height={36} center>
                                    <Ionicons name="people" size={20} color="white" />
                                </View>
                                <Text>5 Friends</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                </Card>

                {/* Personal Information */}
                <View row centerV gap-5 marginB-10>
                    <Ionicons name="settings" size={25} color="black" />
                    <Text text70>General</Text>
                </View>
                <Card padding-15 marginB-25 borderRadius={10} style={{ backgroundColor: Colors.white }}>
                    {[
                        { title: "Edit profile picture", icon: "camera-outline" },
                        { title: "Edit name", icon: "pencil" },
                        { title: "Edit phone number", icon: "call-outline" },
                        { title: "Edit email", icon: "mail-outline" },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} onPress={item.title.includes('picture') ? () => openActionSheet() : () => openModal()}>
                            <View row spread paddingV-10>
                                <View row center gap-10>
                                    <View bg-black br100 width={36} height={36} center>
                                        <Ionicons name={item.icon} size={25} color="white" />
                                    </View>
                                    <Text>{item.title}</Text>
                                </View>
                                <Ionicons name="chevron-forward-outline" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Danger Zone */}
                <View row centerV marginB-10 gap-5>
                    <Ionicons name="alert-circle-outline" size={25} color="red" />
                    <Text text70 color={Colors.red30}>Danger Zone</Text>
                </View>
                <Card padding-15 marginB-25 borderRadius={10} style={{ backgroundColor: Colors.white }}>
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
                                <Ionicons name="chevron-forward-outline" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>
            </ScrollView>

            {/* Popup modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
                        <Animated.View
                            style={[
                                {
                                    height: "95%",
                                    backgroundColor: Colors.white,
                                    padding: 20,
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    marginTop: "auto",
                                    justifyContent: "space-between"
                                },
                                animatedStyle, // Áp dụng animation
                            ]}
                        >
                            {/* Drag Indicator */}
                            <View centerH marginB-10>
                                <View style={{ width: 40, height: 5, backgroundColor: Colors.grey50, borderRadius: 10, marginBottom: 10 }} />
                            </View>

                            {/* Edit name form */}
                            <View flex-1 centerV>
                                <Text text30 style={{ fontWeight: "bold" }} center>Edit your name</Text>
                                <TextField
                                    placeholder="Enter your name"
                                    marginV-20
                                    padding-5
                                    autoFocus
                                    containerStyle={{ borderWidth: 2, borderRadius: 10, height: 50, justifyContent: "center" }}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            {/* Save button */}
                            <Button
                                label="Save"
                                disabled={!name.trim()}
                                backgroundColor={name.trim() ? Colors.green5 : Colors.grey50}
                                marginT-20
                                onPress={closeModal} />
                        </Animated.View>
                    </PanGestureHandler>
                </KeyboardAvoidingView>
            </Modal>
        </GestureHandlerRootView>
    );
};

export default ProfileScreen;
