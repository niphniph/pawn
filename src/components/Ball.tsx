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

  // Pulse effect when selected
  useEffect(() => {
    let pulse: Animated.CompositeAnimation | null = null;
    if (isSelected) {
      pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 450,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 450,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1.0,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (pulse) pulse.stop();
    };
  }, [isSelected]);

  const isPink = color === 'pink';
  const colors: [string, string, ...string[]] = isPink
    ? ['#ffaede', '#ff00cc', '#99007a']
    : ['#9de2ff', '#00ccff', '#007a99'];
  const glowColor = isPink ? '#ff00cc' : '#00ccff';

  const padding = cellSize * 0.08;
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
            shadowColor: isSelected ? glowColor : '#000000',
            shadowOpacity: isSelected ? 0.8 : 0.6,
            shadowRadius: isSelected ? 8 : 4,
            borderWidth: isSelected ? 1.5 : 1,
            borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)',
          },
        ]}
      >
        <LinearGradient colors={colors} style={styles.gradient}>
          {/* Specular Highlight for 3D sphere look */}
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
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  specularHighlight: {
    position: 'absolute',
    top: '12%',
    left: '18%',
    width: '35%',
    height: '22%',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 999,
    transform: [{ rotate: '-30deg' }],
  },
});
export default Ball;
