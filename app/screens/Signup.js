import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fragment, useState } from 'react';
import FormData from 'form-data';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import Popup from '../components/Popup';
import BackBtn from '../components/BackBtn';

export default Signup = (props) => {
  const {loadPage, loadFeed, apiUrl} = props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [taken, setTaken] = useState(false);

  const updateUsernameField = (value) => {
    setUsername(value)
  }
  const updatePasswordField = (value) => {
    setPassword(value)
  }
  const updatePicField = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });
    if (!result.canceled){
      setPic(result.assets[0]);
    }
  }

  const signup = async () => {
    if (username !== "" && password !== "" && pic !== null){
        const formData = new FormData();
        formData.append('pic', {
          name: pic.fileName,
          uri: pic.uri,
          type: pic.mimeType
        });
        formData.append('username', username);
        formData.append('password', password);
        try {
          const res = await axios.post(apiUrl + "signup/", formData, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          }, {timeout: 3000});
          if (res.data === "OK"){
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
            AsyncStorage.setItem('storedUsername', username);
            AsyncStorage.setItem('storedPassword', password);
            const pic = await axios.post(apiUrl + "usrpic/", {username: username, password: password});
            if (pic.data !== "ERROR"){
              loadFeed(username, password, pic.data);
            }
            else {
              console.log("Error while logging in!");
            }
          }
          else if (res.data === "TAKEN"){
            setTaken(true);
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
      setModalVisible(true);
    }
  } 

  return (
    <Fragment>
    <StatusBar style='light'/>
    <View style={styles.signupContainer}>
      <Header/>

      <BackBtn fun={() => loadPage('start')}/>

      <Popup 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible}
        popupMessage="Complete All Fields!" 
        btnText="Close"
      />

      <Popup
        modalVisible={error}
        setModalVisible={setError}
        popupMessage="An Error has Occurred. Sorry!"
        btnText="OK"
      />

      <Popup 
        modalVisible={taken} 
        setModalVisible={setTaken}
        popupMessage="That Username is Already Taken." 
        btnText="OK"
      />

      <View style={styles.signupBoxContainer}>
        <View style={styles.signupBox}>
          <Text style={styles.signupText}>SignUp</Text>
          <View style={styles.signupInputContainer}>
            <TextInput style={styles.signupInput} maxLength={13} onChangeText={updateUsernameField} value={username} placeholder='Username'/>
            <TextInput style={styles.signupInput} secureTextEntry={true} onChangeText={updatePasswordField} value={password} placeholder='Password'/>
            {pic ? (
              <View style={styles.profilePictureView}>
                <Image source={{ uri: pic.uri }} style={{width: 55, height: 55, borderRadius: 40}}/>
                <Button title='Upload Profile Pic' color='#012657' onPress={updatePicField}/>
              </View>
            ):(
              <View>
                <Button title='Upload Profile Pic' color='#012657' onPress={updatePicField}/>
              </View>
            )}
          </View>
          <View style={styles.loginBtn}>
            <Pressable android_ripple={{color: '#012657'}} onPress={signup}>
              <Text style={styles.loginBtnText}>SignUp</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
    </Fragment>
  );
}

// Styling:
const styles = StyleSheet.create({
    // Main Screen
    signupContainer: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#e8e8e8'
    },
    
    // Login Container
    signupBoxContainer: {
      width: '100%',
      height: 575,
      alignItems: 'center',
      justifyContent: 'center'
    },
    signupBox: {
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
    signupText: {
      color: 'black',
      fontWeight: '800',
      fontSize: 45
    },

    // Inputs
    signupInputContainer: {
      width: '100%',
      alignItems: 'center'
    },
    signupInput: {
      width: '90%',
      paddingLeft: 5,
      marginVertical: 7,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      fontSize: 17
    },

    profilePictureView: {
      width: '77%', 
      marginBottom: 10, 
      marginTop: 7, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between'
    },

    //Button
    loginBtn: {
      backgroundColor: '#004AAD',
      width: 200,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 8,
    },
    loginBtnText: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        width: '100%',
        paddingHorizontal: 65,
        paddingVertical: 5
    }
});