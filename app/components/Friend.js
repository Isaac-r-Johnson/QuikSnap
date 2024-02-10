import { StyleSheet, View, Image, Text, Pressable} from 'react-native';

export default Friend = (props) => {
    const {name, img, followFun} = props;
    return (
        <View style={styles.friendContainer}>
            <View style={styles.contentContainer}>
                <Image style={styles.profileImag} source={{uri:img}}/>
                <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.followBtn}>
                <Pressable onPress={() => followFun(name)}>
                    <Text style={styles.followBtnText}>Follow</Text>
                </Pressable>
            </View>
        </View>
    );
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
        fontWeight: '500'
    }
});