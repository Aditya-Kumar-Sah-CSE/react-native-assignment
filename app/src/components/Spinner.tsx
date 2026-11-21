import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { G, Circle, Path } from 'react-native-svg';

interface SpinnerProps {
  color?: string;
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({
  color = '#16A64D',
  size = 22,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: spin }],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 38 38" stroke={color}>
        <G fill="none" fillRule="evenodd">
          <G transform="translate(1, 1)" strokeWidth={3}>
            <Circle strokeOpacity={0.25} cx={18} cy={18} r={18} />
            <Path d="M36 18c0-9.94-8.06-18-18-18" />
          </G>
        </G>
      </Svg>
    </Animated.View>
  );
};

