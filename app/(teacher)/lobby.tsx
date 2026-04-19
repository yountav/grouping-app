import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import { generateGroups } from "../../utils/groupingAlgorithm";

type Student = {
    username: string;
}

export default function LobbyScreen() {
    const { code } = useLocalSearchParams();
    const sessionCode = Array.isArray(code) ? code[0] : code;
    const [students, setStudents] = useState<Student[]>([]);
    const [groups, setGroups] = useState<Student[][]>([]);

    const startQuiz = async () => {
        await updateDoc(doc(db, "sessions", sessionCode), {
            status: "quiz"
        });
    };

    useEffect(() => {
        if (!sessionCode) return;
        const unsub = onSnapshot(
            collection(db, "sessions", sessionCode, "students"),
            (snapshot) => {
                const studentList = snapshot.docs.map(doc => doc.data() as Student);
                setStudents(studentList);
            }
        );
        return unsub;
    }, [sessionCode]);

    const generateGroupsFunction = async () => {
        try {
            const snapshot = await getDocs(
                collection(db, "sessions", sessionCode, "students")
            );
            const studentList = snapshot.docs.map(doc => ({
                username: doc.id,
                ...doc.data()
            }));
            const generatedGroups = generateGroups(studentList, 4);

            await updateDoc(doc(db, "sessions", sessionCode), {
                groups: generatedGroups,
                status: "groups"
            });
            router.push({
                pathname: "/(teacher)/groups",
                params: { pin: sessionCode }
            })
            console.log("Generated Groups:", generatedGroups);
        } catch (error) {
            console.log("Error saving groups: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lobby</Text>
            <View style={styles.pinCard}>
                <Text style={styles.pinLabel}>Class Pin</Text>
                <Text style={styles.pin}>{code}</Text>
            </View>
            <Text style={styles.text}>Students Joined:</Text>

            {students.map((student, index) => (
                <View key={index} style={styles.studentLayout}>
                    <View style={styles.studentAvatar}>
                        <Text style={styles.avatarText}>{student.username.slice(0,2).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.student}>{student.username}</Text>
                </View>
            ))}

            <Pressable style={styles.button} onPress={startQuiz}>
                <Text style={styles.buttonText}>Start Quiz</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={generateGroupsFunction}>
                <Text style={styles.buttonText}>Generate Groups</Text>
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
    pin: {
        color: '#F7F0D4',
        fontSize: 28,
        marginBottom: 20,
        letterSpacing: 8,
        fontWeight: 'bold',
    },
    pinCard: {
        backgroundColor: '#1a0f4a',
        borderRadius: 16,
        padding: 20,
        width: '50%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a1860',
        marginBottom:20
    },
    pinLabel: {
        color: '#6D4DFF',
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        opacity: 0.7,
        marginBottom: 8
    },
    studentLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a0f4a',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        width: '50%',
        borderWidth: 1,
        borderColor: '#2a1860',
        gap: 10
    },
    studentAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#3214B8',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: {
        color: '#FBCA17',
        fontSize: 11,
        fontWeight: '700'
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
        marginBottom: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FBCA17',
        fontSize: 20,
        fontFamily: 'Droid Sans'
    },
});