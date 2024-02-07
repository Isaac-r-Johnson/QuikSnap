import { StyleSheet, Text, View, Pressable} from 'react-native';

export default BackBtn = (props) => {
    return (
        <View style={styles.backBtn}>
          <Pressable onPress={props.fun}>
            <Text style={styles.backBtnArrow}>➜</Text>
          </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    backBtn: {
        width: '95%',
        alignItems: 'flex-start',
        position: 'absolute',
        top: 90
      },
      backBtnArrow: {
        transform: [{ rotate: '180deg'}],
        fontSize: 30,
      }
});