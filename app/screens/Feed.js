import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, Modal, TextInput, Pressable, Switch } from 'react-native';
import { useState, useEffect, useRef, Fragment } from 'react';
import FormData from 'form-data';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import Post from '../components/Post';
import Popup from '../components/Popup';
import * as Location from 'expo-location';
import Loading from '../components/Loading';
import Friend from '../components/Friend';
import Notification from '../components/Notification';
import Footer from '../components/Footer';
import BackBtn from '../components/BackBtn';

export default Feed = (props) => {
  const {username, password, profilePic, allowNotification, allowPublic, apiUrl, logoutFun, loadFeed} = props;
  const [postImage, setPostImage] = useState("");
  const [addPost, setAddPost] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const [error, setError] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDes, setPostDes] = useState("");
  const [posts, setPosts] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [socialSearch, setSocialSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [follows, setFollows] = useState([]);
  const [notification, setNotification] = useState(false);
  const [viewNotification, setViewNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [accountStatus, setAccountStatus] = useState("main");

  const [publicToggle, setPublicToggle] = useState(allowPublic);
  const togglePublic = async () => {
    setPublicToggle(previousState => !previousState);
    await axios.post(apiUrl + "changepublic/", {username: username, password: password, public: !publicToggle});
  }
  const [notiToggle, setNotiToggle] = useState(allowNotification);
  const toggleNoti = async () => {
    setNotiToggle(previousState => !previousState);
    await axios.post(apiUrl + "changenoti/", {username: username, password: password, noti: !notiToggle});
  }

  useEffect(() => {
    getPosts();
    console.log("Feed Update");
  }, [addPost]);

  useEffect(() => {
    if (!showAccount){
      setSocialSearch("");
      getPosts();
      getNotifications();
      console.log("Feed Update");
    }
    else{
      axios.get(apiUrl + 'users/')
      .then(res => {
        setUsers(res.data);
      });
    }
  }, [showAccount]);

  const getDate = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date();
    return months[date.getMonth()] + " " + date.getDate();
  }
  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission not granted');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const {latitude, longitude} = location.coords;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      const currentLocation = response.data.address;

      if (currentLocation.town){
        const location = `${currentLocation.town}, ${currentLocation.state}, ${currentLocation.country}`;
        setLocation(location);
      }
      else if (currentLocation.city){
        const location = `${currentLocation.city}, ${currentLocation.state}, ${currentLocation.country}`;
        setLocation(location);
      }
      else if (currentLocation.village){
        const location = `${currentLocation.village}, ${currentLocation.state}, ${currentLocation.country}`;
        setLocation(location);
      }
  
      if (response.data.address) {
      } else {
        console.error('City name not found in the response');
        return null;
      }
    } catch (error) {
      console.error('Error fetching location info:', error);
      return null;
    }
  }
  const createPost = async () => {
    try{
      const result = await ImagePicker.launchCameraAsync();
      await getLocation();
      setLoading(false);
      if (!result.canceled){
        setPostImage(result.assets[0]);
        setAddPost(true);
      }
    } catch (err){
      console.log("Error Creating Post: " + err);
    }
  }
  const post = async () => {
    if (postTitle !== "" && postImage !== ""){
      const formData = new FormData();
        formData.append('postImage', {
          name: postImage.fileName,
          uri: postImage.uri,
          type: postImage.mimeType
        });
        formData.append('postTitle', postTitle);
        formData.append('postDes', postDes);
        formData.append('username', username);
        formData.append('password', password);
        formData.append('location', location);
        formData.append("date", getDate());
        try {
          const res = await axios.post(apiUrl + "post/", formData, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
          });
          if (res.data === "OK"){
            setAddPost(false);
            setPostImage("");
            setPostTitle("");
            setPostDes("");
            loadFeed(username, password);
          }
          else if (res.data === "ERROR"){
            console.log("Server Error!");
            setError(true);

          }
        } catch (err){
          console.log("You: " + err.message);
          setError(true);
        }
    }else{
      setNotFilled(true);
    }
  }
  const cancelPost = () => {
    setAddPost(false);
    setPostImage("");
    setPostTitle("");
    setPostDes("");
  }
  const updateTitle = (title) => {
    setPostTitle(title);
  }
  const updateDes = (des) => {
    setPostDes(des);
  }
  const updateSocialSearch = (search) => {
    setSocialSearch(search);
  }
  const followUser = (usernameToFollow) => {
    axios.post(apiUrl + "follow/", {accountUsername: username, usernameToFollow: usernameToFollow})
    .then((res) => {
      if (res.data === "OK"){
        console.log(username + " is following " + usernameToFollow);
      }
      else{
        setError(true);
      }
    });
  }
  const unFollowUser = (usernameToUnfollow) => {
    axios.post(apiUrl + "unfollow/", {accountUsername: username, usernameToUnFollow: usernameToUnfollow})
    .then((res) => {
      if (res.data === "OK"){
        console.log(username + " unfollowed " + usernameToUnfollow);
      }
      else{
        setError(true);
      }
    });

  }
  const getPosts = async () => {
    var tempFollows = await axios.post(apiUrl + 'follows/', {accountUsername: username});
    tempFollows = tempFollows.data;
    setFollows(tempFollows);
    const posts = await axios.post(apiUrl + "posts/", {follows: tempFollows, accountName: username});
    if (posts.data !== "ERROR"){
      if (posts.data.length <= 0){
        setPosts(null);
        setLoading(false);
      }
      else{
        setPosts(posts.data.reverse());
        setLoading(false);
      }
    }
    else{
      console.log("Cannot Get Posts");
      setPosts(null);
      setLoading(false);
    }
  }
  const getNotifications = async () => {
    var rawData = await axios.post(apiUrl + 'notifications/', {accountName: username});
    const tempNotifications = rawData.data;
    if (tempNotifications !== "ERROR"){
      if (tempNotifications.length > 0){
        setNotifications(tempNotifications.reverse());
        setNotification(true);
      }
    }
    else{
      setError(true);
      console.log("Notification Error");
    }
  }
  const clearNotifications = async () => {
    setViewNotification(false);
    setNotification(false);
    setNotifications([]);
    const res = await axios.post(apiUrl + 'clear-notifications/', {accountName: username});
    if (res.data === "ERROR"){
      console.log("Error occurred while clearing notifications on server side.")
    }
  }

  if (!loading){
    return (
      <Fragment>
        <StatusBar style='light'/>
        <View style={styles.feedContainer}>
            <Header type={'feed'} notification={notification} notificationFun={() => {setViewNotification(true);}} addPostFun={createPost}/>
      
            <Modal animationType='slide' transparent={false} visible={showAccount}>
              <View style={styles.mainContainer}>
                  {accountStatus === "main" ? (
                    <Fragment>
                      <Header type={'contact'} closeFun={() => setShowAccount(false)}/>
                      <View style={styles.accountScreen}>

                        <View style={styles.accountInfo}>
                          <Image style={styles.profileImg} source={{uri:profilePic}}/>
                          <Text style={styles.accountName}>{username}</Text>
                        </View>

                        <View style={{width: '100%', height: 1, backgroundColor: 'black', marginTop: 10}}></View>

                        <View style={styles.accountBtns}>
                          <View styles={styles.accountBtn}>
                            <Pressable style={styles.accountBtn} onPress={() => setAccountStatus("follow")}>
                                <Text style={styles.accountBtnText}>Friends</Text>
                                <Text style={styles.accountBtnText}>{">"}</Text>
                            </Pressable>
                          </View>
                        </View>
                        {
                          // Settings Button - to be active when settings screen is done.
                          // <View styles={styles.accountBtn}>
                          //   <Pressable style={styles.accountBtn} onPress={() => setAccountStatus('setting')}>
                          //       <Text style={styles.accountBtnText}>Settings</Text>
                          //       <Text style={styles.accountBtnText}>{">"}</Text>
                          //   </Pressable>
                          // </View>
                        }
                      </View>
                    </Fragment>
                  ) : accountStatus === "follow" ? (
                    <Fragment>
                      <View style={styles.backBtn}>
                        <Pressable onPress={() => setAccountStatus('main')}>
                          <Text style={styles.backBtnArrow}>➜</Text>
                        </Pressable>
                      </View>
                      <View style={styles.socialContentContainer}>
                        <TextInput style={styles.socialSearch} placeholder='Search Friends' onChangeText={updateSocialSearch} value={socialSearch}/>

                        <FlatList style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}} data={users} renderItem={user => {
                          if (user.item.username.toLowerCase().includes(socialSearch.toLowerCase())){
                            return <Friend an={username} follows={follows} img={user.item.pic} name={user.item.username} unFollowFun={unFollowUser} followFun={followUser}/>
                          }
                        }}>
                        </FlatList>
                        <View style={{paddingBottom: 20}}></View>
                      </View>
                    </Fragment>
                  ): accountStatus === "setting" ? (
                    <Fragment>
                        <View style={styles.backBtn}>
                          <Pressable onPress={() => setAccountStatus('main')}>
                            <Text style={styles.backBtnArrow}>➜</Text>
                          </Pressable>
                        </View>
                        <View style={styles.socialContentContainer}>

                          <View style={styles.settings}>

                            <View style={styles.setting}>
                              <Text style={styles.settingText}>Public Profile:</Text>
                              <Switch
                                trackColor={{false: '#767577', true: '#012657'}}
                                thumbColor={publicToggle ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={togglePublic}
                                value={publicToggle}
                              />
                            </View>

                            <View style={styles.setting}>
                              <Text style={styles.settingText}>Receive Notifications:</Text>
                              <Switch
                                trackColor={{false: '#767577', true: '#012657'}}
                                thumbColor={notiToggle ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleNoti}
                                value={notiToggle}
                              />
                            </View>
                            
                          </View>

                        <View style={{paddingBottom: 20}}></View>
                      </View>

                    </Fragment>
                  ):(
                    null
                  )}


                <View style={styles.logoutBtnContainer}>
                  <View></View>
                  <View style={styles.logoutBtn}>
                    <Pressable onPress={() => {logoutFun(); }} android_ripple={{color: 'black'}}>
                        <Text style={styles.logoutBtnText}>LOGOUT</Text>
                    </Pressable>
                  </View>
                </View>

              </View>
            </Modal>
                
            <Modal animationType='slide' transparent={false} visible={viewNotification}>
            <View style={styles.mainContainer}>
              <Header type={'contact'} closeFun={clearNotifications}/>
              
              <View style={styles.socialContentContainer}>
                {notification ? (
                  <FlatList style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}} data={notifications} renderItem={notifi => {
                      return <Notification img={notifi.item.pic} notificationText={notifi.item.text}/>
                    }}>
                  </FlatList>
                ):(
                  <View style={styles.noNotiView}>
                    <Text style={styles.noNotiText}>No Notifications</Text>
                  </View>
                )}
                <View style={{paddingBottom: 70}}></View>
              </View>
            </View>
            </Modal>
                  
            <Modal animationType='slide' transparent={false} visible={addPost}>
            <View style={styles.addPostModal}>
            <View style={styles.backBtn}>
              <Pressable onPress={cancelPost}>
                <Text style={styles.backBtnArrow}>➜</Text>
              </Pressable>
            </View>
              <View style={styles.postView}>
                <Image style={styles.postImage} source={{ uri: postImage.uri }}/>
                <View style={styles.postForm}>
                  <TextInput style={styles.postTitle} maxLength={15} onChangeText={updateTitle} value={postTitle} placeholder='Title'/>
                  <TextInput multiline={true} numberOfLines={5} style={styles.postDes} onChangeText={updateDes} value={postDes} placeholder='Description (optional)'/>
                  <View style={styles.postBtn}>
                    <Pressable android_ripple={{color: '#012657'}} onPress={post}>
                      <Text style={styles.postBtnText}>Post</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
            </Modal>
                  
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
                  
            <View style={styles.feedScreen}>
              {posts !== null ? (
                <FlatList style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}} data={posts} renderItem={post => {
                  return <Post usrn={username} usrPic={profilePic} apiUrl={apiUrl} posterUsername={post.item.poster.username} posterPic={post.item.poster.pic} location={post.item.location} date={post.item.date} image={post.item.pic} title={post.item.title} des={post.item.description}/>
                }}/>
              ):(
                <Text style={styles.errorText}>No Posts</Text>
              )}
            </View>
            <Footer postFun={createPost} showFeed={() => setShowAccount(false)} showAccount={() => setShowAccount(true)}/>
        </View>
      </Fragment>
    );
  }
  else if (loading){
    return (<Loading/>);
  }
}

// Styling:
const styles = StyleSheet.create({
    feedContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: '#e8e8e8'
    },
    feedScreen: {
      width: '100%',
      alignItems: 'center'
    },

    // Back Arrow:
    backBtn: {
      width: '95%',
      alignItems: 'flex-start',
      marginLeft: 10,
      marginTop: 10
    },
    backBtnArrow: {
      transform: [{ rotate: '180deg'}],
      fontSize: 25,
    },

    // View Contacts Modal:
    mainContainer: {
      height: '100%',
      width: '100%',
      backgroundColor: '#004AAD',
    },

    accountScreen: {
      padding: 20
    },
    accountInfo: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    profileImg: {
      width: 60,
      height: 60,
      borderRadius: 100
    },
    accountName: {
      fontSize: 35,
      marginLeft: 8,
      fontWeight: '600'
    },
    accountBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: "98%",
      height: 50,
      paddingHorizontal: 10,
      marginTop: 20,
      elevation: 20,
      borderColor: 'black',
      backgroundColor: "#004AAD"
    },
    accountBtnText: {
      fontSize: 23,
      fontWeight: '600'
    },

    socialContentContainer: {
      width: '100%',
      height: '100%',
      marginVertical: 15,
      display: 'flex',
      alignItems: 'center'
    },
    socialSearch: {
      width: '90%',
      paddingLeft: 5,
      marginBottom: 10,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 6,
      color: 'black',
      fontSize: 20
    },

    // Settings:
    settings: {
      width: '100%',
      height: "90",
    },
    setting: {
      width: '100%',
      height: 30,
      marginVertical: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    settingText: {
      fontSize: 20,
      fontWeight: '500'
    },
    settingToggle: {

    },

    // Notifications:
    noNotiView: {
      width: '100%',
      height: 100,
      display: 'flex',
      alignItems: 'center'
    },
    noNotiText: {
      color: 'black',
      fontSize: 32,
      fontWeight: '600',
      borderBottomWidth: 2,
      borderBottomColor: 'black'
    },

    // Add Post
    addPostModal: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    postView: {
      width: '90%',
      height: '90%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    postImage: {
      width: '90%',
      height: '50%',
      borderRadius: 10,
    },
    postForm: {
      margin: 10,
      width: '85%',
      alignItems: 'center'
    },
    postTitle: {
      paddingLeft: 10,
      borderWidth: 2,
      borderColor: 'black',
      width: '100%',
      height: 40,
      fontSize: 20,
      borderRadius: 10,
    },
    postDes: {
      justifyContent: 'flex-start',
      marginVertical: 10,
      paddingTop: 5,
      paddingLeft: 10,
      height: 150,
      width: '100%',
      textAlignVertical: 'top',
      borderWidth: 2,
      borderColor: 'black',
      borderRadius: 10,
      fontSize: 17
    },
    postBtn: {
      backgroundColor: '#004AAD',
      width: 250,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 65
    },
    postBtnText: {
      fontSize: 25,
      fontWeight: '700',
      color: 'white',
      width: '100%',
      paddingHorizontal: 95,
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
      paddingHorizontal: 65
  },

  // Logout Button:
  logoutBtnContainer: {
    width: "100%",
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'space-between'
  },
  logoutBtn: {
    width: 200,
    height: 40,
    backgroundColor: '#cb0a0a',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 10
  },
  logoutBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 59,
    paddingVertical: 7,
  },

  // Error Text:
  errorText: {
    marginTop: 20,
    fontSize: 23,
    fontWeight: '800'
  }

});