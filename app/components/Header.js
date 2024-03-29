import {StyleSheet, View, Text, Image, Pressable} from 'react-native';

export default Header = (props) => {
    var bellImage = '';
    if (props.notification){
        bellImage = require('../assets/yesBell.png');
    }
    else {
        bellImage = require('../assets/noBell.png');
    }

    if (props.type === 'feed'){
        return (
                <View style={styles.header2}>
                    <View style={styles.left}>
                        <Text style={styles.headerText}>QuikSnap</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <View>
                            <Pressable onPress={props.notificationFun}>
                                <Image style={styles.bellBtnImage} source={bellImage}/>
                            </Pressable>
                        </View>
                    </View>
                </View>
        );
    }
    else if (props.type === 'contact'){
        return (
                <View style={styles.header2}>
                    <View style={styles.left}>
                        <Text style={styles.headerText}>QuikSnap</Text>
                    </View>
                    <View style={styles.postBtnView}>
                        <Pressable onPress={props.closeFun}>
                            <Image style={styles.closeBtnImage} source={require("../assets/closeBtn.png")}/>
                        </Pressable>
                    </View>
                </View>
        );
    }
    else {
        return (
                <View style={styles.header1}>
                    <Image style={styles.headerImage} source={require('../assets/logo.png')} />
                    <Text style={styles.headerText}>QuikSnap</Text>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    header1: {
        paddingBottom: 5,
        width: '100%',
        height: 70,
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start'
    },
    header2: {
        paddingBottom: 5,
        width: '100%',
        height: 70,
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    left: {
        flexDirection: 'row',
        marginLeft: 10
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        color: '#F9F8F5',
        fontSize: 30,
        fontWeight: '700'
    },
    headerImage: {
        width: 40,
        height: 40,
        marginHorizontal: 10
    },
    closeBtnImage: {
        width: 27,
        height: 27,
        marginHorizontal: 5
    },
    bellBtnImage: {
        width: 35,
        height: 35,
        marginHorizontal: 10
    },
    postBtnView: {
        marginHorizontal: 10,
    },
    postBtnImage: {
        width: 40,
        height: 40
    }
});