import { StyleSheet, Text, View, Image } from 'react-native';

export default Post = (props) => {
    const {posterUsername, posterPic, location, image, title, des} = props;

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

        </View>
    );
}

const styles = StyleSheet.create({
    post: {
        marginTop: 10,
        height: 600,
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
    }
});