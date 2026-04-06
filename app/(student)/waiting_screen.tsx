import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function WaitingScreen() {
    const { pin, username } = useLocalSearchParams();
    const sessionCode = Array.isArray(pin) ? pin[0] : pin;
    const [status, setStatus] = useState("lobby");

    useEffect(() => {
        if (!sessionCode) return;

        const unsub = onSnapshot(
            doc(db, "sessions", sessionCode),
            (snapshot) => {
                const data = snapshot.data();
                if (!data) return;

                setStatus(data.status);

                if (data.status === "quiz")
                {
                    router.push({
                        pathname: "/(student)/quiz",
                        params: { pin: sessionCode, username }
                    });
                }
                // if (data?.status === "groups") {
                //     router.push({
                //         pathname: "/(student)/groups",
                //         params: {pin: sessionCode, username }
                //     });
                // }
            }
        );
        return unsub;
    }, [sessionCode]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Waiting Room</Text>
        </View>
    )
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
    pin: {
        color: '#F7F0D4',
        fontSize: 28,
        marginBottom: 20,
        letterSpacing: 8,
        fontWeight: 'bold',
    },
    text: {
        color: '#FCCB1A',
        fontSize: 20,
        marginBottom: 15,
    },
    student: {
        fontSize: 18,
        color: '#FCCB1A',
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