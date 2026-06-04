import React from 'react';
import { Text, Image, View, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';    // or '@react-native-community/slider'

const { height } = Dimensions.get('window');
const SLIDER_ZONE_HEIGHT = height * 0.35;     // bottom half of the screen
const SLIDER_THICKNESS   = 44;               // how “fat” the bar should look
export default function SlideControl() {
  return (
    <View style={styles.container}>
      <Image source={ require('./images/hand_labels.png') } style={styles.image} />
      <View style={styles.sliderRow}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.column}>
            <Text style={styles.label}>{String.fromCharCode(65 + i)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              vertical={true}
              step={1}
              thumbTintColor="#E9262D"
              minimumTrackTintColor="#E9262D"
              maximumTrackTintColor="#d3d3d3"
              onValueChange={v => console.log(`Slider ${i + 1}:`, v)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',                 // push row to the bottom
    alignContent: 'center',
  },

  /** Whole strip that takes up the bottom half */
  sliderRow: {
    height: SLIDER_ZONE_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },

  /** One narrow column for each vertical bar */
  column: {
    width: SLIDER_THICKNESS,
    height: '100%',                             // let the bar grow full height
    alignItems: 'center',
  },


  slider: {
    width: SLIDER_ZONE_HEIGHT,                  // track length (half the screen)
    height: SLIDER_THICKNESS,
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    bottom: SLIDER_ZONE_HEIGHT*0.5+50,
  },
  label: {
    fontSize: 28,
    position: 'relative',
    bottom: SLIDER_ZONE_HEIGHT*0.25+50,
  },
  image: {
    margin:'auto',
    top: -50,
    width: height*0.66*0.6,
    height: height*0.6,
  },
});