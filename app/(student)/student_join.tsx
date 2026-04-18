import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { router } from "expo-router";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function JoinScreen()
{
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');

    const joinSession = async () => {
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
        }
    };

    useEffect(() => {
        if (!pin) return;

        const unsub = onSnapshot(
            doc(db, "sessions", pin),
            (snapshot) => {
                const data = snapshot.data();
                if (data?.groups)
                {
                    router.push({
                        pathname: "/(student)/groups",
                        params: { username, pin}
                    });
                }
            }
        );
        return unsub;
    }, [pin, username])

    useEffect(() => {
        if (!pin) return;
        
        const unsub = onSnapshot(
            doc(db, "sessions", pin),
            (snapshot) => {
                const data = snapshot.data();
                if (data?.status === "quiz") {
                    router.push({
                        pathname: "/(student)/quiz",
                        params: { username: username, pin: pin }
                    });
                }
            }
        );
        return unsub;
    }, [pin, username]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Session</Text>
            <Text style={styles.text}>Player Name</Text>
            <TextInput 
                placeholder='Player Name'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <Text style={styles.text}>Class Pin</Text>
            <TextInput 
                placeholder='Class Pin'
                value={pin}
                onChangeText={setPin}
                style={styles.input}
            />

            <Pressable style={styles.button} onPress={joinSession}>
                <Text style={styles.buttonText}>Join</Text>
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
        backgroundColor: 'white',
        fontSize: 16,
        marginBottom: 20,
        borderRadius: 8,
        width: '50%',
        boxSizing: 'border-box',
        textAlign: 'center',
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