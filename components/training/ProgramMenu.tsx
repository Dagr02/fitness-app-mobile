import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

type ProgramMenuProps = {
  onEdit?: () => void;
  onDelete?: () => void;
};


export default function ProgramMenu({ onEdit, onDelete } : ProgramMenuProps) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const menuButtonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

    const openMenu = () => {
        if (menuButtonRef.current) {
            menuButtonRef.current.measure((fx, fy, width, height, px, py) => {
                setPosition({ x: px, y: py, width, height });
                setVisible(true);
            });
        }
    };

    return (
        <View>
            <TouchableOpacity 
                ref={menuButtonRef}
                onPress={(e) => {
                    e.stopPropagation();
                    openMenu();

                }}
                style={styles.menuButton}

            >
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
                    <View style={
                            [
                                styles.modalContent,
                                {
                                    top: position.y + position.height,
                                    left: position.x - 100,
                                }
                            ]
                        }
                    
                    >
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
    menuItem: {
        color: '#fff',
        paddingVertical: 8,
        fontSize: 16,
    },
    modalContent: {
        position: 'absolute',
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 10,
        width: 150,
    },
    menuButton: {
        padding: 6,
    },
    


});
