import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';

type CustomButtonProps = {
    label?: string;
    color?: string;
    textColor?: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

const CustomButton = ({
    label = 'Back',
    color = '#444',
    textColor = '#fff',
    onPress,
    style,
    textStyle,
}: CustomButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: color }, style]}
            accessibilityLabel="Go back to previous screen"
        >
            <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        paddingHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: '#444',
        borderRadius: 6,
        height: 40,
    },
    buttonText: {
        fontWeight: '600',
        color: '#fff',
    },
});

export default CustomButton;
