import React from "react";
import { Notification } from "@/lib/types/Notification";
import { Pressable, ScrollView } from "react-native";
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
          key={`${notif.id}-${notif.unread ? "unread" : "read"}`}
          leftItem={
            notif.type === "actionable"
              ? {
                  text: notif.unread ? "Accept" : "Accepted",
                  background: notif.unread ? Colors.green30 : Colors.grey50,
                  onPress: notif.unread ? () => markAsRead(notif.id) : () => {},
                }
              : undefined
          }
          rightItems={[
            {
              text: "Delete",
              background: Colors.red30,
              onPress: () => removeNotification(notif.id),
            },
          ]}
          style={{
            borderRadius: 10,
            borderColor: notif.unread ? "#D3B7A8" : Colors.grey50,
            borderWidth: 2,
            marginBottom: 10,
          }}
          disableHaptic
          fullSwipeRight
          onFullSwipeRight={() => removeNotification(notif.id)}
          fullSwipeLeft={notif.unread}
          onFullSwipeLeft={() => markAsRead(notif.id)}
        >
          <Pressable
            onPress={
              notif.type === "navigable"
                ? () => markAsRead(notif.id)
                : undefined
            }
          >
            <View row paddingH-15 paddingV-20 backgroundColor="white">
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
                    <View row centerV spread>
                      <Text text70BO>{notif.title}</Text>
                      <Text text90>
                        {formatDateTime(notif.date, notif.time)}
                      </Text>
                    </View>
                    <Text text80>{notif.message}</Text>
                  </View>
                ) : (
                  <View>
                    <View row centerV spread>
                      <Text text70BO color={Colors.grey50}>
                        {notif.title}
                      </Text>
                      <Text text90 color={Colors.grey50}>
                        {formatDateTime(notif.date, notif.time)}
                      </Text>
                    </View>
                    <Text text80 color={Colors.grey50}>
                      {notif.message}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        </Drawer>
      ))}
    </ScrollView>
  );
}

function formatDateTime(date: string, time: string): string {
  const now = new Date();
  const notifDateTime = new Date(`${date}T${time}`);

  const isSameDay =
    now.getFullYear() === notifDateTime.getFullYear() &&
    now.getMonth() === notifDateTime.getMonth() &&
    now.getDate() === notifDateTime.getDate();

  if (isSameDay) {
    return notifDateTime.toTimeString().slice(0, 5);
  } else {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[notifDateTime.getMonth()];
    const day = String(notifDateTime.getDate()).padStart(2, "0");
    return `${day} ${month}`;
  }
}

export default NotificationList;
