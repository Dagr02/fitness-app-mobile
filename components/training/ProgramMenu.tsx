import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function ProgramMenu({ onEdit, onDelete }) {
    const [visible, setVisible] = useState(false);

    return (
        <View style={{ position: 'absolute', top: 10, right: 10 }}>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Entypo name="dots-three-vertical" size={18} color="#fff" />
            </TouchableOpacity>

            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    onPress={() => setVisible(false)}
                >
                    <View style={styles.menu}>
                        {onEdit && (
                            <TouchableOpacity onPress={() => { setVisible(false); onEdit(); }}>
                                <Text style={styles.menuItem}>Edit Program</Text>
                            </TouchableOpacity>
                        )}
                        {onDelete && (
                            <TouchableOpacity onPress={() => { setVisible(false); onDelete(); }}>
                                <Text style={styles.menuItem}>Delete Program</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding: 20,
    },
    menu: {
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 10,
        minWidth: 150,
    },
    menuItem: {
        color: '#ffd33d',
        paddingVertical: 8,
        fontSize: 16,
    },
});
