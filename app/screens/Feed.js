import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, Modal, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import FormData from 'form-data';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import Post from '../components/Post';
import Popup from '../components/Popup';
import * as Location from 'expo-location';
import Loading from '../components/Loading';
import Friend from '../components/Friend';

export default Feed = (props) => {
  const {username, password, apiUrl, loadFeed} = props;

  const [postImage, setPostImage] = useState("");
  const [addPost, setAddPost] = useState(false);
  const [notFilled, setNotFilled] = useState(false);
  const [error, setError] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDes, setPostDes] = useState("");
  const [posts, setPosts] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSocial, setShowSocial] = useState(true);
  const [socialSearch, setSocialSearch] = useState("");

  var tempData = [1, 2, 3]

  useEffect(() => {
    getPosts();
    console.log("Feed Update");
  }, [addPost])

  const getLocation = async () => {
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
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
    });
    getLocation();
    if (!result.canceled){
      setPostImage(result.assets[0]);
      setAddPost(true);
    }
  }
  const post = async () => {
    if (postTitle !== "" && postDes !== "" && postImage !== ""){
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

  const getPosts = async () => {
    const posts = await axios.get(apiUrl + "posts/");
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
  if (!loading){
    return (
      // <>
      // <StatusBar style='light'/>
      <View style={styles.feedContainer}>
          <Header type={'feed'} openFun={() => setShowSocial(true)} addPostFun={createPost}/>

          <Modal animationType='slide' transparent={false} visible={showSocial}>
            <View style={styles.mainContainer}>
              <Header type={'contact'} closeFun={() => setShowSocial(false)}/>
              <View style={styles.socialContentContainer}>
                <TextInput style={styles.socialSearch} placeholder='Search Friends' onChangeText={updateSocialSearch} value={socialSearch}/>
                <FlatList style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}} data={tempData} renderItem={temp => {
                  return <Friend img="https://res.cloudinary.com/dqaxkucbu/image/upload/v1707364657/QuikSnap/yusjllmou8bpvxvlunbc.jpg" name="Isaac Johnson"/>
                }}>
                  
                </FlatList>
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
                  <TextInput style={styles.postTitle} onChangeText={updateTitle} value={postTitle} placeholder='Title'/>
                  <TextInput multiline={true} numberOfLines={5} style={styles.postDes} onChangeText={updateDes} value={postDes} placeholder='Description'/>
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
                return <Post posterUsername={post.item.poster.username} posterPic={post.item.poster.pic} location={post.item.location} image={post.item.pic} title={post.item.title} des={post.item.description}/>
              }}/>
            ):(
              <Text style={styles.errorText}>Loading Posts...</Text>
            )}
          </View>
  
      </View>
      // </>
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
      marginBottom: 5
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

  // Error Text:
  errorText: {
    marginTop: 20,
    fontSize: 23,
    fontWeight: '800'
  }

});