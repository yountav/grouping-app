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
            <Text style={styles.pin}>Class Pin: {code}</Text>
            <Text style={styles.text}>Students Joined:</Text>

            {students.map((student, index) => (
                <Text key={index} style={styles.text}>
                    {student.username}
                </Text>
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