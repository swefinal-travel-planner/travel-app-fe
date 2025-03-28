import { Link } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";

import SpotCard from "@/components/SpotCard";
import CarouselSpotCard from "@/components/CarouselSpotCard";
import Pressable from "@/components/Pressable";

import styles from "../styles";
import { Carousel } from "react-native-ui-lib";

const data = [
  {
    spotName: "War Remnants Museum",
    spotLocation: "28 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh",
    spotImage:
      "https://lh3.googleusercontent.com/p/AF1QipPwjfXoTp4uuEBODAptmwg054U6pzYeLUhS9W-o=s1360-w1360-h1020",
    isSaved: false,
  },
  {
    spotName: "Le Quy Don High School",
    spotLocation: "110 Nguyễn Thị Minh Khai, Phường 6, Quận 3, Hồ Chí Minh",
    spotImage:
      "https://lh5.googleusercontent.com/p/AF1QipMtzP5eSZmnAm8xzqo4yvC6dqgALsMgj33CZXWu=w408-h725-k-no",
    isSaved: false,
  },
  {
    spotName: "Co.opmart Nguyễn Đình Chiểu",
    spotLocation: "168 Nguyễn Đình Chiểu, Phường 6, Quận 3, Hồ Chí Minh",
    spotImage:
      "https://lh5.googleusercontent.com/p/AF1QipOYQjPY1L6dzxJYj7t-eTSl8_5FyGWdFwsri3d8=w408-h306-k-no",
    isSaved: false,
  },
  {
    spotName: "HCMC Cultural Palace for Labors",
    spotLocation:
      "55B Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, Hồ Chí Minh",
    spotImage:
      "https://lh5.googleusercontent.com/p/AF1QipPqWjKxgEF2SvrpljDjKqR6-u2tfItMBpUzjOT5=w408-h725-k-no",
    isSaved: false,
  },
];

const hasTrip = true;

// get screen width for responsive sizing
const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth - 120; // account for margins and padding

const Index = () => {
  return (
    <ScrollView
      style={styles.mainContainer}
      contentContainerStyle={homeStyles.scrollContent}
    >
      <View style={homeStyles.container}>
        <View style={homeStyles.topCenter}>
          <Text style={homeStyles.hugeText}>Welcome back, bro!</Text>

          <Link href="/signup" style={styles.mainButton}>
            Go to Signup screen
          </Link>

          {hasTrip ? (
            <View style={homeStyles.currentTrip}>
              <Text style={homeStyles.subText}>This morning's plan</Text>
              <Text style={homeStyles.mainText}>Ho Chi Minh City</Text>

              <Carousel
                pagingEnabled
                containerPaddingVertical={8}
                initialPage={0}
                containerStyle={{
                  width: cardWidth,
                  height: 240,
                }}
                containerMarginHorizontal={0}
                pageControlPosition={Carousel.pageControlPositions.UNDER}
                pageControlProps={{ color: "#A68372" }}
              >
                {data.map((item, index) => (
                  <CarouselSpotCard key={index} {...item} />
                ))}
              </Carousel>

              <Pressable
                title={"View trip details"}
                style={homeStyles.button}
                variant="primary"
              ></Pressable>
            </View>
          ) : (
            <View style={homeStyles.currentTrip}>
              <Text style={styles.mainText}>Your next great trip awaits!</Text>

              <Pressable
                title={"Plan a new trip"}
                style={homeStyles.button}
                variant="primary"
              ></Pressable>
            </View>
          )}
        </View>

        <Text style={[styles.mainText, homeStyles.mainText]}>
          Cool spots near you
        </Text>

        <FlatList
          horizontal={true}
          style={[homeStyles.list, { marginBottom: 28 }]}
          contentContainerStyle={homeStyles.listContent}
          data={data}
          renderItem={({ item }) => <SpotCard {...item} />}
          keyExtractor={(item) => item.spotName}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={[styles.mainText, homeStyles.mainText]}>
          Spots you've visited
        </Text>

        <FlatList
          horizontal={true}
          style={homeStyles.list}
          contentContainerStyle={homeStyles.listContent}
          data={data}
          renderItem={({ item }) => <SpotCard {...item} />}
          keyExtractor={(item) => item.spotName}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

export default Index;

const homeStyles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 80,
  },
  list: {
    flexGrow: 0,
    marginHorizontal: -40,
  },
  listContent: {
    paddingHorizontal: 40,
  },
  subText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#563D30",
    fontFamily: "NotoSerif_400Regular",
  },
  mainText: {
    fontSize: 20,
    color: "#563D30",
    fontFamily: "NotoSerif_400Regular",
    marginBottom: 12,
  },
  hugeText: {
    fontSize: 28,
    color: "#563D30",
    fontFamily: "NotoSerif_400Regular",
  },
  topCenter: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  currentTrip: {
    width: "100%",
    borderRadius: 12,
    marginVertical: 24,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A68372",
  },
  button: {
    marginTop: 16,
  },
});
