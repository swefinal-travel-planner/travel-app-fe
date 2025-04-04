import React from "react";
import { Notification } from "@/app/type";
import { ScrollView, TouchableOpacity } from "react-native";
import { View, Text, Drawer, Colors, Avatar } from "react-native-ui-lib";

interface NotificationListProps {
  notificationList: Notification[];
  removeNotification: (id: number) => void;
  markAsRead: (id: number) => void;
}

function NotificationList({
  notificationList,
  removeNotification,
  markAsRead,
}: NotificationListProps) {
  return (
    <ScrollView>
      {notificationList.map((notif) => (
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
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
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
  );
}

export default NotificationList;
