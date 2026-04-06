import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grouping App</Text>
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
        backgroundColor: '#3214B8',
        padding: 15,
        marginBottom: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FBCA17',
        fontSize: 20,
        fontFamily: 'Droid Sans'
    },
});