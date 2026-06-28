import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BallProps {
  color: 'pink' | 'cyan';
  isSelected: boolean;
  cellSize: number;
  positionAnim: Animated.ValueXY;
}

export const Ball: React.FC<BallProps> = ({ color, isSelected, cellSize, positionAnim }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse scale animation when it's this ball's turn
  useEffect(() => {
    let pulse: Animated.CompositeAnimation | null = null;
    if (isSelected) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.12,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.96,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (pulse) pulse.stop();
    };
  }, [isSelected]);

  const isPink = color === 'pink';
  const colors: [string, string, ...string[]] = isPink
    ? ['#ffaede', '#ff00cc', '#800066']
    : ['#cceeff', '#00ccff', '#006680'];
  const glowColor = isPink ? '#ff00cc' : '#00ccff';

  const padding = cellSize * 0.12;
  const ballSize = cellSize - padding * 2;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          width: cellSize,
          height: cellSize,
          padding: padding,
          transform: [
            ...positionAnim.getTranslateTransform(),
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.ballOuter,
          {
            borderRadius: ballSize / 2,
            shadowColor: glowColor,
            shadowOpacity: isSelected ? 0.9 : 0.5,
            shadowRadius: isSelected ? 10 : 5,
            borderWidth: 1.5,
            borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.25)',
          },
        ]}
      >
        <LinearGradient colors={colors} style={styles.gradient}>
          {/* Specular Highlight for 3D sphere look */}
          <View style={styles.specularHighlight} />
          {/* Secondary subtle shadow highlight */}
          <View style={styles.shadowHighlight} />
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballOuter: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  specularHighlight: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: '32%',
    height: '22%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 999,
    transform: [{ rotate: '-35deg' }],
  },
  shadowHighlight: {
    position: 'absolute',
    bottom: '8%',
    right: '8%',
    width: '40%',
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 999,
  },
});
export default Ball;
