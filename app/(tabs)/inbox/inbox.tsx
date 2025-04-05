import React, { useState } from "react";
import { View, Text, Colors, Chip } from "react-native-ui-lib";
import { ScrollView } from "react-native";
import { Notification, NotificationCategory } from "@/app/type";
import NotificationList from "./components/NotificationList";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Inbox() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Lời mời kết bạn",
      message: "An Nguyễn đã gửi cho bạn một lời mời kết bạn.",
      type: "actionable",
      category: "friend",
      date: "2025-04-04",
      time: "10:30",
      sender: "An Nguyễn",
      senderAvatar: require("@/assets/images/capy.jpg"),
      unread: true,
    },
    {
      id: 2,
      title: "Chia sẻ vị trí",
      message: "Minh Trần đang chia sẻ vị trí với bạn.",
      type: "actionable",
      category: "location",
      date: "2025-04-03",
      time: "16:45",
      sender: "Minh Trần",
      senderAvatar: require("@/assets/images/capy.jpg"),
      unread: false,
    },
    {
      id: 3,
      title: "Chỉnh sửa chuyến đi",
      message: "Hoài Phương đã chỉnh sửa chuyến đi 'Đi Thỉnh Kinh'.",
      type: "navigable",
      category: "trip",
      date: "2025-04-02",
      time: "08:20",
      sender: "Hoài Phương",
      senderAvatar: require("@/assets/images/capy.jpg"),
      unread: true,
    },
    {
      id: 4,
      title: "Sắp đến chuyến đi!",
      message: "Còn 3 ngày nữa là đến chuyến đi 'Đà Lạt mộng mơ'.",
      type: "navigable",
      category: "reminder",
      date: "2025-04-01",
      time: "09:00",
      sender: "Hệ thống",
      senderAvatar: require("@/assets/images/capy.jpg"),
      unread: true,
    },
    {
      id: 5,
      title: "Lịch trình chưa hoàn tất",
      message:
        "Bạn còn 2 địa điểm hôm nay chưa tham quan, có muốn dời sang ngày mai không?",
      type: "navigable",
      category: "reminder",
      date: "2025-04-01",
      time: "17:15",
      sender: "Hệ thống",
      senderAvatar: require("@/assets/images/capy.jpg"),
      unread: false,
    },
    {
      id: 6,
      title: "Dự báo thời tiết",
      message: "Hôm nay có khả năng mưa cao, hãy chuẩn bị áo mưa nhé!",
      type: "navigable",
      category: "weather",
      date: "2025-04-04",
      time: "07:30",
      sender: "Hệ thống",
      senderAvatar: require("@/assets/images/capy.jpg"),
      unread: true,
    },
    {
      id: 7,
      title: "Từ chối lời mời",
      message: "Thư Vy đã từ chối lời mời đi chơi của bạn.",
      type: "navigable",
      category: "friend",
      date: "2025-03-30",
      time: "14:10",
      sender: "Thư Vy",
      senderAvatar: require("@/assets/images/capy.jpg"),
      unread: false,
    },
  ]);

  const categories: (NotificationCategory | "all")[] = [
    "all",
    "friend",
    "location",
    "trip",
    "reminder",
    "weather",
  ];

  const [activeCategory, setActiveCategory] = useState<
    NotificationCategory | "all"
  >("all");

  const filteredNotifications =
    activeCategory === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeCategory);

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
    <View flex paddingT-20 paddingH-20 backgroundColor={Colors.grey80}>
      <Text text40 marginB-20>
        Notifications
      </Text>

      <View row marginB-15>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={
                cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)
              }
              onPress={() => setActiveCategory(cat)}
              containerStyle={{
                marginRight: 10,
                borderColor: activeCategory === cat ? "#D3B7A8" : Colors.grey50,
                backgroundColor:
                  activeCategory === cat ? "#D3B7A8" : "transparent",
              }}
              labelStyle={{
                color: activeCategory === cat ? "white" : Colors.grey30,
                fontWeight: "500",
                fontSize: 16,
              }}
            />
          ))}
        </ScrollView>
      </View>

      {filteredNotifications.length === 0 ? (
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
        <NotificationList
          notificationList={filteredNotifications}
          removeNotification={removeNotification}
          markAsRead={markAsRead}
        />
      )}
    </View>
  );
}
