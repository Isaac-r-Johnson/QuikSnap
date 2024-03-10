import { StyleSheet, View, Image, Text, Pressable, Dimensions} from 'react-native';
import { useState, useEffect } from 'react';

export default Notification = (props) => {
    const {img, notificationText} = props;
    
    return (
        <View style={styles.notificationContainer}>
            <View style={styles.contentContainer}>
                <Image style={styles.profileImag} source={{uri:img}}/>
                <Text numberOfLines={5} style={styles.notification}>{notificationText}</Text>
            </View>
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    notificationContainer: {
        marginVertical: 4,
        paddingBottom: 5,
        width: windowWidth-20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderBottomColor: 'black',
        borderBottomWidth: 2
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
    notification: {
        width: windowWidth-60,
        fontSize: 20,
        fontWeight: '600',
        color: 'black'
    }
});