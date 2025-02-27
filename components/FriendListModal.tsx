import React from "react";
import { View, Text, Colors, Modal, Card, Avatar, Button } from "react-native-ui-lib";
import { KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { PanGestureHandler, ScrollView, State } from "react-native-gesture-handler";
import Animated, { withSpring, useAnimatedStyle } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";


const FriendListModal = ({ translateY, visible, closeModal, friendList }) => {

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

    // Tạo animation cho modal
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));


    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
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
                            <View style={{ width: 40, height: 5, backgroundColor: Colors.grey50, borderRadius: 10, marginBottom: 10 }} />
                        </View>
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "center",
                                borderRadius: 20,
                                padding: 15,
                                width: "90%",
                                backgroundColor: "#f0f0f0",
                            }}
                        >
                            <Ionicons name="search" size={25} />
                            <Text text60 marginL-10>Add a new friend</Text>
                        </TouchableOpacity>

                        <ScrollView style={{ padding: 20 }}>
                            <View row centerV gap-5 marginT-20 marginB-10>
                                <Ionicons name="people" size={25} color="black" />
                                <Text text60>Your friends</Text>
                            </View>
                            <Card padding-15 marginB-25 borderRadius={10} style={{ backgroundColor: Colors.white }}>
                                {friendList.map((friend, id) => (
                                    <View key={id} row spread paddingV-10 centerV>
                                        <View row center gap-10>
                                            <View style={{ borderWidth: 3, borderColor: "green", borderRadius: 100, padding: 3 }}>
                                                <Avatar size={40} source={friend.avatar} />
                                            </View>
                                            <Text text60>{friend.name}</Text>
                                        </View>
                                        <Ionicons name="close-outline" size={25} color="black" />
                                    </View>
                                ))}
                                <Button
                                    label="Show more"
                                    marginT-15
                                    backgroundColor={Colors.green5}
                                    labelStyle={{ fontWeight: "bold" }}
                                    style={{ width: "auto", alignSelf: "center" }}
                                />
                            </Card>

                            <View row centerV gap-5 marginT-20 marginB-10>
                                <Ionicons name="paper-plane" size={25} color="black" />
                                <Text text60>Share your request link</Text>
                            </View>
                            <Card padding-15 marginB-25 borderRadius={10} style={{ backgroundColor: Colors.white }}>
                                {[
                                    { name: "Facebook", icon: "logo-facebook" },
                                    { name: "Instagram", icon: "logo-instagram" },
                                    { name: "LinkedIn", icon: "logo-linkedin" },
                                    { name: "Tiktok", icon: "logo-tiktok" },
                                ].map((app, index) => (
                                    <View key={index} row spread paddingV-10 centerV>
                                        <View row center gap-10>
                                            <View bg-black br100 width={50} height={50} center>
                                                <Ionicons name={app.icon} size={30} color="white" />
                                            </View>
                                            <Text text60>{app.name}</Text>
                                        </View>
                                        <Ionicons name="chevron-forward-outline" size={25} color="black" />
                                    </View>
                                ))}
                            </Card>
                        </ScrollView>
                    </Animated.View>
                </PanGestureHandler>
            </KeyboardAvoidingView>
        </Modal>
    )
}
export default FriendListModal