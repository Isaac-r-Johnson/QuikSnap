import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Popup from '../components/Popup';
import BackBtn from '../components/BackBtn';
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default Login = (props) => {
  const {loadPage, loadFeed, apiUrl} = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notFilled, setNotFilled] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [error, setError] = useState(false);

  const updateUsernameField = (value) => {
    setUsername(value);
  }
  const updatePasswordField = (value) => {
    setPassword(value);
  }

  const login = async () => {
    if (username !== "" && password !== ""){
      try {
        const res = await axios.post(apiUrl + 'login/', {username: username, password: password}, {timeout: 3000});
        if (res.data === "OK"){
          AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
          AsyncStorage.setItem('storedUsername', username);
          AsyncStorage.setItem('storedPassword', password);
          loadFeed(username, password);
        }
        else if (res.data === "NO"){
          setIncorrectPassword(true);
        }
        else {
          setError(true);
        }
      } catch (err){
        setError(true);
        console.log(err);
      }
    }
    else{
      setNotFilled(true);
    }
  }

  return (
    <>
    <StatusBar style='light'/>
    <View style={styles.loginContainer}>
      <Header/>

      <BackBtn fun={() => loadPage('start')}/>

      <Popup
        modalVisible={incorrectPassword}
        setModalVisible={setIncorrectPassword}
        popupMessage="Username or Password is Incorrect!"
        btnText="Close"
      />

      <Popup
        modalVisible={notFilled}
        setModalVisible={setNotFilled}
        popupMessage="Complete All Fields!"
        btnText="Close"
      />

      <Popup
        modalVisible={error}
        setModalVisible={setError}
        popupMessage="An Error has Occurred. Sorry!"
        btnText="OK"
      />


      <View style={styles.loginBoxContainer}>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>Login</Text>
          <View style={styles.loginInputContainer}>
            <TextInput style={styles.loginInput} onChangeText={updateUsernameField} value={username} placeholder='Username'/>
            <TextInput style={styles.loginInput} secureTextEntry={true} onChangeText={updatePasswordField} value={password} placeholder='Password'/>
          </View>
          <View style={styles.loginBtn}>
            <Pressable android_ripple={{color: '#012657'}} onPress={login}>
              <Text style={styles.loginBtnText}>Login</Text>
            </Pressable>
        </View>
        </View>
      </View>
    </View>
    </>
  );
}

// Styling:
const styles = StyleSheet.create({
    // Main Screen
    loginContainer: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#e8e8e8'
    },
    
    // Login Container
    loginBoxContainer: {
      width: '100%',
      height: 575,
      alignItems: 'center',
      justifyContent: 'center'
    },
    loginBox: {
      width: '75%',
      height: '50%',
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      elevation: 20,
      shadowColor: '#012657',
    },

    // Text
    loginText: {
      color: 'black',
      fontWeight: '800',
      fontSize: 45
    },

    // Inputs
    loginInputContainer: {
      width: '100%',
      alignItems: 'center'
    },
    loginInput: {
      width: '90%',
      paddingLeft: 5,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      fontSize: 17
    },

    // Button
    loginBtn: {
      backgroundColor: '#004AAD',
      width: 200,
      height: 40,
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
        paddingHorizontal: 70,
        paddingVertical: 5
    },

    // Modal:
    modalView: {
      width: "100%",
      height: "100%",
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000bf',
    },
    popupBox: {
      marginBottom: 65,
      width: '83%',
      height: '30%',
      backgroundColor: '#ffffffff',
      borderRadius: 10,
      elevation: 80,
      shadowColor: '#f8f8f8',
      alignItems: 'center',
      justifyContent: 'center'
    },
    popupText: {
      color: 'black',
      fontSize: 40,
      fontWeight: '600',
      fontStyle: 'italic',
      textAlign: 'center',
      marginHorizontal: 20
    },
    popupBtn: {
      backgroundColor: '#012657',
      width: 200,
      height: 30,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 15,
    },
    popupBtnText: {
      fontSize: 20,
      fontWeight: '700',
      color: 'white',
      width: '100%',
      paddingHorizontal: 65,
    }
});