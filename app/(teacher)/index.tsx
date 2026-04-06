import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function HomeSceen()
{
    const [gameCode, setGameCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());
    
    const createSession = async () => {
        try {
            await setDoc(doc(db, "sessions", gameCode), {
                createdAt: Date.now(),
                status: "lobby"
            });

            router.push({
                pathname: "/(teacher)/lobby",
                params: { code: gameCode }
            });
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grouping App</Text>
            <Text style={styles.text}>Class Pin:</Text>
            <Text style={styles.pin}>{gameCode}</Text>

            <Pressable style={styles.button} onPress={createSession}>
                <Text style={styles.buttonText}>Start</Text>
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