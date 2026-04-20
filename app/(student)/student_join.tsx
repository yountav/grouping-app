import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function JoinScreen()
{
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const joinSession = async () => {
        if (!username.trim() || !pin.trim())
        {
            setError('Please enter both a name and a pin.')
            return;
        }
        try {
            await setDoc(doc(db, "sessions", pin, "students", username), {
                username: username,
                joinedAt: Date.now(),
                finished: false
            });
            router.replace({
                pathname: "/(student)/waiting_screen",
                params: { pin, username }
            })
            console.log("Student joined!");
        } catch (error) {
            console.log("Error: ", error);
            setError('Could not join session, check your pin and try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Session</Text>
            <Text style={styles.text}>Your Name</Text>
            <TextInput 
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <Text style={styles.text}>Class Pin</Text>
            <TextInput 
                placeholder='6-Digit Code'
                value={pin}
                onChangeText={setPin}
                style={styles.input}
            />
            {error ? <Text style={styles.text}>{error}</Text> : null}
            <Pressable style={styles.button} onPress={joinSession}>
                <Text style={styles.buttonText}>Join Session</Text>
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
        fontWeight: 'bold',
        marginBottom: 36,
    },
    text: {
        color: '#FCCB1A',
        fontSize: 20,
        marginBottom: 15,
    },
    input: {
        width: '80%',
        borderWidth: 1.5,
        borderColor: '#3214B8',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        color: '#6D4DFF'
    },
    button: {
        backgroundColor: '#3214B8',
        padding: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FBCA17',
        fontSize: 20,
        fontFamily: 'Droid Sans'
    },
});