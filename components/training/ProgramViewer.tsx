import {StyleSheet} from 'react-native';

export default function ProgramViewer() {
    return <Program program_id={id} user_id={uId} style={styles.program} />;
}

const styles = StyleSheet.create({
    program: {
        width: 320,
        height: 320,
        borderRadius: 18,
    }
})