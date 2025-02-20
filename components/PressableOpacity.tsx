import { useRef } from "react";
import { Pressable, Animated } from "react-native";

interface PressableOpacityProps {
    children: React.ReactNode;
    [key: string]: any;
}

const PressableOpacity = ({ children, ...props }: PressableOpacityProps) => {
    const animated = useRef(new Animated.Value(1)).current;

    const fadeIn = () => {
        Animated.timing(animated, {
            toValue: 0.1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };
    const fadeOut = () => {
        Animated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable onPressIn={fadeIn} onPressOut={fadeOut} {...props}>
            <Animated.View style={{ opacity: animated }}>{children}</Animated.View>
        </Pressable>
    );
};

export default PressableOpacity;
