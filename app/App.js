import {useState, useEffect} from 'react'
import 'react-native';
import { StatusBar } from 'expo-status-bar';
import FormData from 'form-data';
import axios from 'axios';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Feed from './screens/Feed';
import Start from './screens/Start';

export default function App() {
  const [page, setPage] = useState("start");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const apiUrl = "https://quiksnap-api.vercel.app/";

  useEffect(() => {
    console.log("Rendered");
  }, [page]);

  const switchToFeed = (username, password) => {
    setUsername(username);
    setPassword(password)
    setPage('feed');
  }

  const loadPage = (thePage) => {
    setPage(thePage);
  }

  if (page === "start"){
    return (<Start loadPage={loadPage}/>);
  }
  if (page === "login"){
    return (<Login loadPage={loadPage} loadFeed={switchToFeed} apiUrl={apiUrl}/>);
  }
  else if (page === "signup"){
    return (<Signup loadPage={loadPage} loadFeed={switchToFeed} apiUrl={apiUrl}/>);
  }
  else if (page === "feed"){
    return (<Feed username={username} password={password} apiUrl={apiUrl} loadFeed={switchToFeed}/>);
  }
}
