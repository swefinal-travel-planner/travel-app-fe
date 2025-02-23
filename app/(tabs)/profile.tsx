import React, { useState } from "react";
import { View, Text, Avatar, Button, Card, Colors, Modal, Icon } from "react-native-ui-lib";
import { TouchableOpacity, ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";


const ProfileScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const openModal = (content) => {
        setModalContent(content);
        setModalVisible(true);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.grey80, paddingTop: 30 }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>

                <View center>
                    <View
                        style={{
                            borderWidth: 5,
                            borderColor: "green",
                            borderRadius: 100,
                            padding: 3,
                        }}
                    >
                        <Avatar
                            size={120}
                            source={require("@/assets/images/alligator.jpg")}
                        />
                    </View>
                    <Text text50 marginT-10>채수빈</Text>
                </View>


                {/* Friendlist */}
                <View row centerV gap-5 marginB-10>
                    <Ionicons name="person-add" size={20} color="black" />
                    <Text>Friend</Text>
                </View>
                <Card marginB-25 padding-15 row spread borderRadius={10} style={{ backgroundColor: Colors.white }}>
                    <View row center gap-10>
                        <View bg-black br100 width={36} height={36} center>
                            <Ionicons name="people" size={20} color="white" />
                        </View>
                        <Text>5 Friends</Text>
                    </View>
                    <TouchableOpacity onPress={() => alert("Go to Friends List")}>
                        <Ionicons name="chevron-forward-outline" size={20} color="black" />
                    </TouchableOpacity>
                </Card>

                {/* Personal Information */}
                <View row centerV gap-5 marginB-10>
                    <Ionicons name="settings" size={25} color="black" />
                    <Text text70>General</Text>
                </View>
                <Card padding-15 marginB-25 borderRadius={10} style={{ backgroundColor: Colors.white }}>
                    {[
                        { title: "Edit profile picture", icon: <Ionicons name="camera-outline" size={25} color="white" /> },
                        { title: "Edit name", icon: <Ionicons name="pencil" size={25} color="white" /> },
                        { title: "Edit phone number", icon: <Ionicons name="call-outline" size={25} color="white" /> },
                        { title: "Edit email", icon: <Ionicons name="mail-outline" size={25} color="white" /> },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => openModal(item.title)}>
                            <View row spread paddingV-10>
                                <View row center gap-10>
                                    <View bg-black br100 width={36} height={36} center>
                                        {item.icon}
                                    </View>
                                    <Text>
                                        {item.title}
                                    </Text>
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
                        { title: "Delete account", icon: <Ionicons name="trash-outline" size={20} color="white" /> },
                        { title: "Log out", icon: <Ionicons name="log-out-outline" size={20} color="white" /> },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => alert(item.title)}>
                            <View row spread paddingV-10>
                                <View row center gap-10>
                                    <View bg-black br100 width={36} height={36} center>
                                        {item.icon}
                                    </View>
                                    <Text>
                                        {item.title}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward-outline" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </Card>
            </ScrollView>

            {/* Popup modal */}
            <Modal
                visible={modalVisible}
                onBackgroundPress={() => setModalVisible(false)}
                animationType="slide"
            >
                <View
                    style={{
                        backgroundColor: Colors.white,
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    }}
                >
                    <Text text50>{modalContent}</Text>
                    <Button label="Close" marginT-20 onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
};

export default ProfileScreen;
