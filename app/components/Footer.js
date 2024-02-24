import {StyleSheet, View, Text, Image, Pressable} from 'react-native';

export default Footer = (props) => {
    const {postFun, showFeed, showAccount} = props;
    return (
        <View style={styles.banner}>
            <View style={styles.feedBtn}>
                <Pressable style={{alignItems: 'center'}} onPress={showFeed}>
                    <Image style={styles.footerIcon} source={require('../assets/feedIcon.png')}/>
                    <Text style={styles.btnText}>Feed</Text>
                </Pressable>
            </View>

            <View style={styles.postBtn}>
                <Pressable onPress={postFun}>
                    <Image style={styles.postBtnImage} source={require('../assets/addPostBtn.png')}/>
                </Pressable>
                </View>

            <View style={styles.accountBtn}>
                <Pressable style={{alignItems: 'center'}} onPress={showAccount}>
                    <Image style={styles.footerIcon} source={require('../assets/accountIcon.png')}/>
                    <Text style={styles.btnText}>Account</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        width: '100%',
        height: 45,
        paddingHorizontal: 40,
        backgroundColor: '#004AAD',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footerIcon: {
        width: 20,
        height: 20 , 
    },
    footerIconPressed: {

    },
    btnText: {
        color: 'white',
        fontWeight: '700'
    },
    feedBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        width: 'auto'
    },
    postBtnImage: {
        width: 60,
        height: 60,
        borderRadius: 50,
        marginBottom: 25
    },
    postBtn: {
        marginLeft: "5%",
        alignItems: 'center',
        backgroundColor: '#004AAD',
        borderRadius: 50,
        padding: 10,
    },
    accountBtn: {
        alignSelf: 'center',
        alignItems: 'center',
    }
});