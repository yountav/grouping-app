import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>SkillSync</Text>
            <Text style={styles.subtitle}>Smart Student Grouping</Text>
            <Pressable style={styles.button} onPress={() => router.push("/(teacher)")}>
                <Text style={styles.buttonText}>I'm a Teacher</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.push("/(student)/student_join")}>
                <Text style={styles.buttonText}>I'm a Student</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#110934',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#6D4DFF',
        fontSize: 36,
        fontFamily: 'Futura',
        fontWeight: 'bold',
        marginBottom: 36,
    },
    subtitle: {
        color: '#6D4DFF',
        fontSize: 11,
        letterSpacing: 1.2,
        opacity: 0.6,
        marginBottom: 24
    },
    text: {
        color: '#FCCB1A',
        fontSize: 20,
        marginBottom: 20,
    },
    pin: {
        color: '#F7F0D4',
        fontSize: 28,
        marginBottom: 20,
        letterSpacing: 8,
        fontWeight: 'bold',
    },
    button: {
        width: '80%',
        borderWidth: 1.5,
        borderColor: '#3214B8',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginBottom: 10
    },
    buttonText: {
        color: '#FBCA17',
        fontSize: 20,
        fontFamily: 'Droid Sans'
    },
});