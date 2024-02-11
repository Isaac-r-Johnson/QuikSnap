import { StyleSheet, View, Image, Text, Pressable, Dimensions} from 'react-native';
import { useState, useEffect } from 'react';

export default Notification = (props) => {
    const {img, notificationText} = props;
    
    return (
        <View style={styles.notificationContainer}>
            <View style={styles.contentContainer}>
                <Image style={styles.profileImag} source={{uri:img}}/>
                <Text style={styles.notification}>{notificationText}</Text>
            </View>
        </View>
    );
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    notificationContainer: {
        marginVertical: 4,
        width: windowWidth-20,
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
        height: 'fit-content',
        fontSize: 20,
        fontWeight: '600',
        color: 'black'
    }
});