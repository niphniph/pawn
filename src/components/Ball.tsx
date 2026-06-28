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

  // Subtle pulsing animation when it is the active turn
  useEffect(() => {
    let pulse: Animated.CompositeAnimation | null = null;
    if (isSelected) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.97,
            duration: 600,
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
  
  // High-contrast glossy gradient colors matching reference screenshot exactly
  const colors: [string, string, ...string[]] = isPink
    ? ['#ff73cc', '#ff1a8c', '#800040'] // Vibrant pink marble
    : ['#66e0ff', '#009dff', '#004c80']; // Vibrant cyan marble

  // Size proportion: occupies ~82% of the cell
  const ballSize = cellSize * 0.82;
  const padding = (cellSize - ballSize) / 2;

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
            width: ballSize,
            height: ballSize,
            borderRadius: ballSize / 2,
          },
        ]}
      >
        <LinearGradient colors={colors} style={styles.gradient}>
          {/* Circular Glossy Specular Highlight Spot in top-left */}
          <View style={styles.specularHighlight} />
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
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  specularHighlight: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '26%',
    height: '26%',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    opacity: 0.9,
  },
});
export default Ball;
