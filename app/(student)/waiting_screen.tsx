import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function WaitingScreen() {
    const { pin, username } = useLocalSearchParams();
    // Gets session and user info from navigation
    const sessionCode = Array.isArray(pin) ? pin[0] : pin;
    const studentName = Array.isArray(username) ? username[0] : username;
    const navigated = useRef(false);

    const [status, setStatus] = useState("lobby");
    const [isFinished, setIsFinished] = useState(false);
    const [currentScreen, setCurrentScreen] = useState("");

    // Listens to changes in session status
    useEffect(() => {
        if (!sessionCode) return;

        const unsub = onSnapshot(
            doc(db, "sessions", sessionCode),
            (snapshot) => {
                const data = snapshot.data();
                if (data?.status) setStatus(data.status);
            }
        );
        return unsub;
    }, [sessionCode]);

    // Listens to changes in each student's doc including tracking quiz progress and detects if they're booted
    useEffect(() => {
        if (!sessionCode || !studentName) return;

        const unsub = onSnapshot(
            doc(db, "sessions", sessionCode, "students", studentName),
            (snapshot) => {
                if (!snapshot.exists()) {
                    router.replace({
                        pathname: "/",
                        params: { booted: "true" }
                    });
                    return;
                }
                setIsFinished(snapshot.data()?.finished ?? false);
            }
        );
        return unsub;
    }, [sessionCode, studentName]);

    // Navigates students based on session state
    useEffect(() => {
        if (navigated.current) return;

        // Redirects to quiz when teacher starts quiz
        if (status === 'quiz' && !isFinished)
        {
            navigated.current = true;
            router.replace({
                pathname: "/(student)/quiz",
                params: { pin: sessionCode, username: studentName}
            });
            // Redirects to grouping screen when teacher generates groups
        } else if (status === 'groups')
        {
            navigated.current = true;
            router.replace({
                pathname: "/(student)/groups",
                params: { pin: sessionCode, username: studentName }
            });
        }
    }, [status, isFinished]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Waiting Room</Text>
            <Text style={styles.text}>Waiting for the teacher...</Text>
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