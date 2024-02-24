import { StyleSheet, View, Animated, Easing, Text, Image} from 'react-native';
import React from 'react';

export default Loading = () => {
    const rotationValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 300, // Adjust the duration as needed
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotationValue]);

  const rotateInterpolate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

    return (
        <View style={styles.main}>
            <Animated.View style={{ ...styles.loading, transform: [{rotate: rotateInterpolate}]}}>
              <Image style={{width: 50, height: 50, borderRadius: 100}} source={require('../assets/loading.png')}/>
            </Animated.View>
            <Text style={styles.text}>Loading....</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  main: {
      width: "100%",
      height: "100%",
      backgroundColor: '#e8e8e8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
  },
  loading: {
      width: 50,
      height: 50,
      borderRadius: 100,
      marginBottom: 15,
      justifyContent: 'center',
      alignItems: 'center'
  },
  text: {
    fontSize: 17
  }

});