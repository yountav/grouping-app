import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { router } from "expo-router";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
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
        if (!pin || !username) return;

        const unsub = onSnapshot(
            doc(db, "sessions", pin),
            async (snapshot) => {
                const data = snapshot.data();
                if (!data) return;

                if (data.groups)
                {
                    router.replace({
                        pathname: "/(student)/groups",
                        params: { username, pin }
                    });
                    return;
                }
                if (data.status === "quiz")
                {
                    const studentSnapshot = await getDoc(doc(db, "sessions", pin, "students", username));
                    if (!studentSnapshot.data()?.finished)
                    {
                        router.replace({
                            pathname: "/(student)/quiz",
                            params: { username, pin }
                        });
                    }
                }
            }
        );
        return unsub;
    }, [pin, username]);

    // useEffect(() => {
    //     if (!pin) return;

    //     const unsub = onSnapshot(
    //         doc(db, "sessions", pin),
    //         (snapshot) => {
    //             const data = snapshot.data();
    //             if (data?.groups)
    //             {
    //                 router.push({
    //                     pathname: "/(student)/groups",
    //                     params: { username, pin}
    //                 });
    //             }
    //         }
    //     );
    //     return unsub;
    // }, [pin, username])

    // useEffect(() => {
    //     if (!pin) return;
        
    //     const unsub = onSnapshot(
    //         doc(db, "sessions", pin),
    //         async (snapshot) => {
    //             const data = snapshot.data();
    //             if (data?.status === "quiz") {
    //                 const studentRef = doc(db, "sessions", pin, "students", username);
    //                 const studentSnapshot = await getDoc(studentRef);
    //                 if (!studentSnapshot.data()?.finished)
    //                 {
    //                     router.replace({
    //                         pathname: "/(student)/quiz",
    //                         params: { username: username, pin: pin }
    //                     });
    //                 }
    //             }
    //         }
    //     );
    //     return unsub;
    // }, [pin, username]);

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