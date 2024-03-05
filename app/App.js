import {useState, useEffect} from 'react'
import 'react-native';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Feed from './screens/Feed';
import Start from './screens/Start';
import Loading from './components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PushNotificationObject } from 'react-native-push-notification';
import axios from 'axios';

export default function App() {
  const [page, setPage] = useState("start");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [publicPro, setPublic] = useState(null);
  const [thePic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  // const apiUrl = "https://quiksnap-api.vercel.app/";
  const apiUrl = "http://192.168.12.193:5000/";

  useEffect(() => {
    console.log("Rendered");
    // setLoading(true);
    // setTimeout(() => { 
    //       setLoading(false); 
    //   }, 500);
  }, [page]);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    try{
      const data = await AsyncStorage.getItem('isLoggedIn');
      if (data){
        const usrn = await AsyncStorage.getItem("storedUsername");
        const pass = await AsyncStorage.getItem("storedPassword");
        const pic = await axios.post(apiUrl + "usrpic/", {username: usrn, password: pass});
        if (pic.data !== "ERROR"){
          switchToFeed(usrn, pass, pic.data.pic, pic.data.noti, pic.data.public);
        }
        else {
          console.log("Error while logging in!");
        }
      }
    } catch (err){
      console.log("Error reading storage: " + err);
    }
  }

  const clearStorage = () => {
    AsyncStorage.clear();
    loadPage('start');
  }

  const switchToFeed = (username, password, pic, noti, publicPro) => {
    setUsername(username);
    setPassword(password);
    setPic(pic);
    setNotification(noti);
    setPublic(publicPro);
    setPage('feed');
  }

  const loadPage = (thePage) => {
    setPage(thePage);
  }

  if (page === "start" && !loading){
    return (<Start loadPage={loadPage}/>);
  }
  else if (page === "login" && !loading){
    return (<Login loadPage={loadPage} loadFeed={switchToFeed} apiUrl={apiUrl}/>);
  }
  else if (page === "signup" && !loading){
    return (<Signup loadPage={loadPage} loadFeed={switchToFeed} apiUrl={apiUrl}/>);
  }
  else if (page === "feed" && !loading){
    return (<Feed username={username} password={password} profilePic={thePic}  allowNotification={notification} allowPublic={publicPro} apiUrl={apiUrl}  logoutFun={clearStorage} loadFeed={switchToFeed}/>);
  }

  if (loading){
    return (<Loading/>)
  }
}
