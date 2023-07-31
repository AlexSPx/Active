import React from "react";
import { View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import FA5Icon from "react-native-vector-icons/FontAwesome5";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "react-native-paper";
import { createThemedStyle } from "../themes/createThemedStyle";

type LeftSwipeableComponentProps = {
  children: React.ReactNode;
  onSwipe: () => void;
};

const TRANSLATE_X_THRESHOLD = -100;

const useStyles = createThemedStyle((theme) => ({
  icon: {
    position: "absolute",
    right: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: theme.colors.errorContainer,
    justifyContent: "center",
  },
}));

export default function LeftSwipeableComponent({
  children,
  onSwipe,
}: LeftSwipeableComponentProps) {
  const { colors } = useTheme();

  const translationX = useSharedValue(0);

  const onSwipeHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart(_, context: any) {
        context.startX = translationX.value;
      },
      onActive: (event) => {
        translationX.value = event.translationX;
      },
      onEnd: (event) => {
        if (event.translationX < TRANSLATE_X_THRESHOLD) {
          // Swipe to the left detected, animate the item off the screen
          translationX.value = withSpring(-200, {}, () => {
            runOnJS(onSwipe)();
          });
          translationX.value = withDelay(400, withTiming(0)); // fixes next element in the list not returning
        } else {
          // Not a swipe to the left, reset item position
          translationX.value = withSpring(0);
        }
      },
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
    backgroundColor: "red",
  }));

  const animatedIconStyles = useAnimatedStyle(() => {
    const opacity = withTiming(
      translationX.value < TRANSLATE_X_THRESHOLD ? 1 : 0
    );
    return { opacity };
  });

  const styles = useStyles();

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[animatedIconStyles, styles.icon]}>
        <FA5Icon name="trash" size={20} color={colors.error} />
      </Animated.View>
      <PanGestureHandler onGestureEvent={onSwipeHandler}>
        <Animated.View style={[animatedStyle]}>
          <View>{children}</View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}
