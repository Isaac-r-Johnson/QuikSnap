import {StyleSheet, Pressable, View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';



export default function Start(props) {
  const {loadPage} = props;

  return (
    <>
    <StatusBar style='light'/>
    <Header/>
    <View style={styles.startPage}>
        <Text style={styles.titleText}>Welcome to QuickSnap!</Text>
        <View style={styles.btn}>
            <Pressable android_ripple={{color: '#012657'}} onPress={() => loadPage('login')}>
              <Text style={styles.loginBtnText}>Login</Text>
            </Pressable>
        </View>
        <View style={styles.btn}>
            <Pressable android_ripple={{color: '#012657'}} onPress={() => loadPage('signup')}>
              <Text style={styles.loginBtnText}>Signup</Text>
            </Pressable>
        </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
    startPage: {
        width: "100%",
        height: "85%",
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleText: {
        color: 'black',
        fontSize: 40,
        fontWeight: '600',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 15
      },
      btn: {
        backgroundColor: '#004AAD',
        width: 250,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7,
      },
      loginBtnText: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        width: '100%',
        paddingHorizontal: 92,
        paddingVertical: 10
    }
});