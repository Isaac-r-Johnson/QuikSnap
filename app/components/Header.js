import {StyleSheet, View, Text, Image, Pressable} from 'react-native';

export default Header = (props) => {
    if (props.type === 'feed'){
        return (
            <View style={styles.overlay}>
                <View style={styles.header2}>
                    <View style={styles.left}>
                        <Pressable onPress={props.openFun}>
                            <Image style={styles.headerImage} source={require('../assets/logo.png')} />
                        </Pressable>
                        <Text style={styles.headerText}>QuikSnap</Text>
                    </View>
                    <View style={styles.postBtnView}>
                        <Pressable onPress={props.addPostFun}>
                            <Image style={styles.postBtnImage} source={require("../assets/postBtn.png")}/>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }
    else if (props.type === 'contact'){
        return (
            <View style={styles.overlaySocial}>
                <View style={styles.header2}>
                    <View style={styles.left}>
                        <Image style={styles.headerImage} source={require('../assets/logo.png')} />
                        <Text style={styles.headerText}>QuikSnap</Text>
                    </View>
                    <View style={styles.postBtnView}>
                        <Pressable onPress={props.closeFun}>
                            <Image style={styles.closeBtnImage} source={require("../assets/closeBtn.png")}/>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }
    else {
        return (
            <View style={styles.overlay}>
                <View style={styles.header1}>
                    <Image style={styles.headerImage} source={require('../assets/logo.png')} />
                    <Text style={styles.headerText}>QuikSnap</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        width: '100%',
        height: 80,
        justifyContent: 'flex-end',
        backgroundColor: '#012657',
    },
    overlaySocial: {
        width: '100%',
        height: 55,
        justifyContent: 'flex-end',
        backgroundColor: '#012657',
    },
    header1: {
        paddingBottom: 5,
        width: '100%',
        height: 50,
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start'
    },
    header2: {
        paddingBottom: 5,
        width: '100%',
        height: 50,
        backgroundColor: '#004AAD',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    left: {
        flexDirection: 'row'
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