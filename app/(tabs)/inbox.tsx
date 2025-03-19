import React, { useState } from "react";
import { View, Text, Drawer, Colors, Avatar } from "react-native-ui-lib";
import { ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  sender: string;
  senderAvatar: string;
  unread: boolean;
}

export default function Inbox() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Message",
      message: "You have a new message from Alice.",
      type: "message",
      sender: "Alice",
      senderAvatar: require("@/assets/images/pig.jpg"),
      unread: true,
    },
    {
      id: 2,
      title: "Friend Request",
      message: "Bob sent you a friend request.",
      type: "friend_request",
      sender: "Bob",
      senderAvatar: require("@/assets/images/pig.jpg"),
      unread: false,
    },
  ]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif,
      ),
    );
  };

  return (
    <View flex padding-20 backgroundColor={Colors.grey80}>
      <Text text40 marginB-20>
        Notifications
      </Text>
      {notifications.length === 0 ? (
        <View flex center>
          <Ionicons
            name="notifications-off-outline"
            size={50}
            color={Colors.grey50}
          />
          <Text text60 color={Colors.grey50} marginT-10>
            No Notifications
          </Text>
        </View>
      ) : (
        <ScrollView>
          {notifications.map((notif) => (
            <Drawer
              key={notif.id}
              rightItems={[
                {
                  text: "Delete",
                  background: Colors.red30,
                  onPress: () => removeNotification(notif.id),
                },
              ]}
              onFullSwipeRight={() => removeNotification(notif.id)}
              style={{
                borderRadius: 10,
                borderColor: notif.unread ? "#D3B7A8" : Colors.grey50,
                borderWidth: 2,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity onPress={() => markAsRead(notif.id)}>
                <View row paddingH-15 paddingV-20 backgroundColor="white" br10>
                  <View
                    center
                    style={{
                      borderWidth: 2,
                      borderColor: notif.unread ? "#D3B7A8" : Colors.grey50,
                      borderRadius: 50,
                    }}
                  >
                    <Avatar source={notif.senderAvatar} size={40} />
                  </View>
                  <View marginL-10 flex>
                    {notif.unread ? (
                      <View>
                        <Text text70BO>{notif.title}</Text>
                        <Text text80>{notif.message}</Text>
                      </View>
                    ) : (
                      <View>
                        <Text text70 color={Colors.grey50}>
                          {notif.title}
                        </Text>
                        <Text text80 color={Colors.grey50}>
                          {notif.message}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Drawer>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
