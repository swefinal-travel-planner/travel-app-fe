import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface EditProfileModalProps {
  visible: boolean;
  closeModal: () => void;
  field: string;
  value: string;
  onSave: (value: string, field: string) => void;
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  closeModal,
  field,
  value,
  onSave,
}) => {
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState("");
  const translateY = useSharedValue(0);

  useEffect(() => {
    setTempValue(value);
    setError("");
  }, [value, visible]);

  // Gesture để vuốt xuống đóng modal
  const swipeDown = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = event.translationY > 0 ? event.translationY : 0;
    })
    .onEnd((event) => {
      if (event.translationY > 100) {
        closeModal();
      } else {
        translateY.value = withSpring(0);
      }
    });

  // Animation style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal} // Nhấn ngoài modal để đóng
      swipeDirection="down" // Vuốt xuống để đóng
      onSwipeComplete={closeModal}
      backdropOpacity={0.5} // Làm tối nền
      style={styles.modalContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <GestureDetector gesture={swipeDown}>
          <Animated.View style={[styles.modalContent, animatedStyle]}>
            {/* Thanh vuốt xuống */}
            <View style={styles.dragHandle} />

            {/* Tiêu đề */}
            <Text style={styles.title}>
              {field.includes("name")
                ? "Edit your name"
                : field.includes("phone")
                  ? "Edit your phone number"
                  : "Edit your email"}
            </Text>

            {/* Input */}
            <TextInput
              style={styles.input}
              placeholder={
                field.includes("name")
                  ? "Enter your name"
                  : field.includes("phone")
                    ? "Enter your phone number"
                    : "Enter your email"
              }
              keyboardType={field.includes("phone") ? "phone-pad" : "default"}
              value={tempValue}
              onChangeText={setTempValue}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Nút Lưu */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: error ? "gray" : "#4CAF50" },
              ]}
              onPress={() => onSave(tempValue, field)}
              disabled={!!error}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    height: "40%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  saveButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileModal;
