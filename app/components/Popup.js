import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';

export default Popup = (props) => {
    const {modalVisible, setModalVisible, popupMessage, btnText} = props;

    return (
        <Modal animationType='fade' transparent={true} visible={modalVisible}>
            <View style={styles.modalView}>
                <View style={styles.popupBox}>
                    <Text style={styles.popupText}>{popupMessage}</Text>
                    <View style={styles.popupBtn}>
                        <Pressable android_ripple={{color: '#012657'}} onPress={() => setModalVisible(false)}>
                            <Text style={styles.popupBtnText}>{btnText}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
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
      }
});