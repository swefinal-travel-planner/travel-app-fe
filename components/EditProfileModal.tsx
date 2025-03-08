import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Colors,
  Modal,
  TextField,
} from "react-native-ui-lib";
import { KeyboardAvoidingView, Platform } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

const EditProfileModal = ({
  translateY,
  visible,
  closeModal,
  field,
  value,
  onSave,
}) => {
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => {
    setTempValue(value);
    setError("");
  }, [value, visible]);

  const validateInputs = (field, value) => {
    let error = "";
    if (field.includes("name") && !value.trim()) {
      error = "Name cannot be empty";
    } else if (field.includes("phone") && !/^[0-9]{10}$/.test(value)) {
      error = "Phone must be 10 digits";
    } else if (
      field.includes("email") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Invalid email format";
    }
    setError(error);
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

  // Tạo animation cho modal
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
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
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                marginTop: "auto",
                justifyContent: "space-between",
              },
              animatedStyle,
            ]}
          >
            <View centerH marginB-10>
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

            <View flex-1 centerV>
              <Text text30 style={{ fontWeight: "bold" }} center>
                {field.includes("name")
                  ? "Edit your name"
                  : field.includes("phone")
                    ? "Edit your phone number"
                    : "Edit your email"}
              </Text>
              <TextField
                marginV-20
                padding-5
                autoFocus
                keyboardType={
                  field === "Edit phone number" ? "number-pad" : "default"
                }
                containerStyle={{
                  borderWidth: 2,
                  borderRadius: 10,
                  height: 50,
                  justifyContent: "center",
                }}
                placeholder={
                  field.includes("name")
                    ? "Enter your name"
                    : field.includes("phone")
                      ? "Enter your phone number"
                      : "Enter your email"
                }
                value={tempValue}
                onChangeText={(text) => {
                  setTempValue(text);
                  validateInputs(field, text);
                }}
              />
              <Text text65 red30>
                {error}
              </Text>
            </View>

            <Button
              label="Save"
              backgroundColor={Colors.green5}
              marginT-20
              disabled={!!error}
              onPress={() => onSave(tempValue, field)}
            />
          </Animated.View>
        </PanGestureHandler>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default EditProfileModal;
