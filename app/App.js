import {useState, useEffect} from 'react'
import 'react-native';
import { StatusBar } from 'expo-status-bar';
import FormData from 'form-data';
import axios from 'axios';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Feed from './screens/Feed';
import Start from './screens/Start';
import Loading from './components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [page, setPage] = useState("start");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = "https://quiksnap-api.vercel.app/";
  // const apiUrl = "http://192.168.1.193:5000/";

  useEffect(() => {
    console.log("Rendered");
    setLoading(true);
    setTimeout(() => { 
          setLoading(false); 
      }, 500);
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
        switchToFeed(usrn, pass);
      }
    } catch (err){
      console.log("Error reading storage: " + err);
    }
  }

  const clearStorage = () => {
    AsyncStorage.clear();
  }

  const switchToFeed = (username, password) => {
    setUsername(username);
    setPassword(password);
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
    return (<Feed username={username} password={password} apiUrl={apiUrl} loadFeed={switchToFeed}/>);
  }

  if (loading){
    return (<Loading/>)
  }
}
