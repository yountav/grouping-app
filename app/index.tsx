import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Home() {
    const { booted } = useLocalSearchParams();
    return (
        <View style={styles.container}>
            <Image source={require('../assets/team_img.png')} style={styles.logo} />
            <Text style={styles.title}>SkillSync</Text>
            <Text style={styles.subtitle}>Smart Student Grouping</Text>

            { /* If student is removed from session, displays a message and redirects them to start */}
            {booted === "true" && (
                <View style={styles.bootedLabel}>
                    <Text style={styles.bootedText}>You have been removed from the session.</Text>
                </View>
            )}

            {/* Navigates users based on whether they are a student or teacher and continues to navigate them accordingly */}
            <Pressable style={styles.button} onPress={() => router.replace("/(teacher)")}>
                <Text style={styles.buttonText}>I'm a Teacher</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => router.replace("/(student)/student_join")}>
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
        marginBottom: 25,
        marginTop: 10
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 55,
        marginBottom: 20
    },
    subtitle: {
        color: '#6D4DFF',
        fontSize: 25,
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
    bootedLabel: {
        backgroundColor: '#4a0f0f',
        borderWidth: 1,
        borderColor: '#8b0000',
        borderRadius: 10,
        padding: 12,
        marginBottom: 24,
        width: '100%'
    },
    bootedText: {
        color: '#ff6b6b',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '600'
    }
});