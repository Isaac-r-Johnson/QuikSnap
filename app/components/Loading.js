import { StyleSheet, View, Animated, Easing, Text} from 'react-native';
import React from 'react';

export default Loading = () => {
    const rotationValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 500, // Adjust the duration as needed
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
            <Animated.View style={{ ...styles.loading, transform: [{rotate: rotateInterpolate}]}}></Animated.View>
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
      borderColor: 'white',
      backgroundColor: '#004AAD',
      width: 50,
      height: 50,
      borderRadius: 100,
      borderWidth: 5,
      borderBottomRightRadius: 10,
      elevation: 20,
      marginBottom: 15
  },
  text: {
    fontSize: 17
  }

});