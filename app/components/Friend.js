import { StyleSheet, View, Image, Text, Pressable} from 'react-native';
import { useState, useEffect } from 'react';

export default Friend = (props) => {
    const {an, follows, name, img, unFollowFun, followFun} = props;
    const [following, setFollowing] = useState(null);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (follows){
            follows.forEach(follow => {
                if (follow === name && !clicked){
                    setFollowing(true);
                }
            });
        }
        if (following === null){
            setFollowing(false);
        }
        if (clicked){
            setClicked(false);
        }
    }, [following])

    if (an === name){
        null
    }
    else {
        return (
            <View style={styles.friendContainer}>
                <View style={styles.contentContainer}>
                    <Image style={styles.profileImag} source={{uri:img}}/>
                    <Text style={styles.name}>{name}</Text>
                </View>
                <View style={styles.btnContainer}>
                    {following ? (
                        <View style={styles.unFollowBtn}>
                            <Pressable onPress={() => {unFollowFun(name); setFollowing(false); setClicked(true)}} android_ripple={{color: '#004AAD'}}>
                                <Text style={styles.unFollowBtnText}>Unfollow</Text>
                            </Pressable>
                        </View>
                    ):(
                        <View style={styles.followBtn}>
                            <Pressable onPress={() => {followFun(name); setFollowing(true)}} android_ripple={{color: '#004AAD'}}>
                                <Text style={styles.followBtnText}>Follow</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    friendContainer: {
        marginVertical: 5,
        width: "90%",
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileImag: {
        width: 45,
        height: 45,
        borderRadius: 100,
        marginRight: 10
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: 'black'
    },
    btnContainer: {
        width: 71,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    followBtn: {
        width: 60,
        height: 30,
        backgroundColor: '#012657',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10
    },
    followBtnText: {
        color: '#E8E8E8',
        fontWeight: '500',
        paddingHorizontal: 9,
        paddingVertical: 5
    },
    unFollowBtn: {
        width: 71,
        height: 30,
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10
    },
    unFollowBtnText: {
        color: '#012657',
        fontWeight: '500',
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 5
    }
});