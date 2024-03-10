import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default Post = (props) => {
    const {usrn, usrPic, apiUrl, posterUsername, posterPic, location, image, title, des} = props;

    const likeBorder = require('../assets/likeBorder.png');
    const likeFill = require('../assets/likeFill.png');
    const disBorder = require('../assets/disBorder.png');
    const disFill = require('../assets/disFill.png');

    const [likeBtn, setLikeBtn] = useState(likeBorder);
    const [disBtn, setDisBtn] = useState(disBorder);
    const [like, setLike] = useState(false);
    const [dis, setDis] = useState(false);

    useEffect(() => {
        if (like){
            setLikeBtn(likeFill);
        }
        else if (!like){
            setLikeBtn(likeBorder);
        }
        if (dis){
            setDisBtn(disFill);
        }
        else if (!dis){
            setDisBtn(disBorder);
        }
    }, [like, dis]);

    useEffect(() => {
        getReactions();
    }, []);

    const getReactions = async () => {
        res = await axios.post(apiUrl + 'getreactions/', {picUrl: image});
        res.data.likes.forEach(like => {
            if (like.username === usrn){
                setLike(true);
                setDis(false);
            }
        });
        res.data.diss.forEach(dis => {
            if (dis.username === usrn){
                setLike(false);
                setDis(true);
        }
       });
    }

    const likePost = async () => {
        res = await axios.post(apiUrl + 'likepost/', {username: usrn, pic: usrPic, posterName: posterUsername, postTitle: title, postPicUrl: image});
        console.log(res.data);
    }

    const disPost = async () => {
        res = await axios.post(apiUrl + 'dispost/', {username: usrn, pic: usrPic, posterName: posterUsername, postTitle: title, postPicUrl: image});
        console.log(res.data);
    }

    return (
        <View style={styles.post}>
            <View style={styles.profile}>
                <Image style={styles.profilePicImage} source={{uri:posterPic}}/>
                <View style={styles.profileTextView}>
                    <Text style={styles.profileTextName}>{posterUsername}</Text>
                    <Text style={styles.profileTextLocation}>{location}</Text>
                </View>
            </View>
            <View style={styles.postText}>
                <Text style={styles.postTitle}>{title}</Text>
                <View style={styles.postDesView}>
                    <Text style={styles.postDesText}>{des}</Text>
                </View>
            </View>
            <Image style={styles.postImage} source={{uri:image}}/>
            <View style={styles.interactButtonsView}>
                <Pressable  onPress={() => {disPost(); setDis(true); setLike(false)}}>
                    <Image style={styles.interactButton} source={disBtn}/>
                </Pressable>
                <Pressable onPress={() => {likePost(); setLike(true); setDis(false)}}>
                    <Image style={styles.interactButton} source={likeBtn}/>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    post: {
        marginTop: 10,
        height: 'fit-content',
        width: 375,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        elevation: 20,
        shadowColor: '#012657',
    },
    profile: {
        width: '90%',
        marginVertical: 10,
        paddingBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    profilePicImage: {
        width: 45,
        height: 45,
        borderRadius: 40
    },
    profileTextView: {
        marginLeft: '5%',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    profileTextName: {
        color: 'black',
        fontWeight: '700',
        fontSize: 25,
    },
    profileTextLocation: {
        color: 'black',
        fontWeight: '300',
    },
    postText: {
        width: '100%',
        alignItems: 'center'
    },
    postTitle: {
        color: 'black',
        fontSize: 40,
        fontWeight: '800',
        fontStyle: 'italic'

    },
    postDesView: {
        width: '75%',
        alignItems: 'center'
    },
    postDesText: {
        color: 'black',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    postImage: {
        marginTop: 10,
        width: '90%',
        height: 400,
        borderRadius: 10
    },
    interactButtonsView: {
        height: 60,
        width: "60%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    interactButton: {
        width: 30, 
        height: 30,
    }
});