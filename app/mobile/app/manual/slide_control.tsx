import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');
const SLIDER_ZONE_HEIGHT = height * 0.35;
const SLIDER_THICKNESS = 44;

type WebSliderChangeEvent = {
  target: {
    value: string;
  };
};

export default function SlideControl() {
  const [values, setValues] = useState([0, 0, 0, 0, 0]);

  const updateValue = (index: number, value: number) => {
    setValues((current) =>
      current.map((currentValue, currentIndex) =>
        currentIndex === index ? value : currentValue
      )
    );
  };

  return (
    <View style={styles.container}>
      <Image source={require('./images/hand_labels.png')} style={styles.image} />
      <View style={styles.sliderRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.column}>
            <Text style={styles.label}>{String.fromCharCode(65 + i)}</Text>
            <Text style={styles.value}>{values[i]}</Text>
            {Platform.OS === 'web' ? (
              React.createElement('input', {
                'aria-label': `Finger ${String.fromCharCode(65 + i)}`,
                max: 100,
                min: 0,
                onChange: (event: WebSliderChangeEvent) =>
                  updateValue(i, Number(event.target.value)),
                step: 1,
                style: {
                  accentColor: '#E9262D',
                  height: SLIDER_THICKNESS,
                  transform: 'rotate(-90deg)',
                  width: SLIDER_ZONE_HEIGHT,
                },
                type: 'range',
                value: values[i],
              })
            ) : (
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                vertical
                step={1}
                thumbTintColor="#E9262D"
                minimumTrackTintColor="#E9262D"
                maximumTrackTintColor="#d3d3d3"
                value={values[i]}
                onValueChange={(value) => updateValue(i, value)}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'center',
  },

  sliderRow: {
    height: SLIDER_ZONE_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },

  column: {
    width: SLIDER_THICKNESS,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  slider: {
    width: SLIDER_ZONE_HEIGHT,
    height: SLIDER_THICKNESS,
    transform: [{ rotate: '-90deg' }],
  },
  label: {
    fontSize: 28,
    position: 'absolute',
    top: 0,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    position: 'absolute',
    bottom: 0,
  },
  image: {
    alignSelf: 'center',
    top: -50,
    width: height * 0.66 * 0.6,
    height: height * 0.6,
    resizeMode: 'contain',
  },
});
