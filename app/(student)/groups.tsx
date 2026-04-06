import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Student = {
    username: string;
}

export default function GroupScreen() {
    const { username, pin } = useLocalSearchParams();
    const sessionCode = Array.isArray(pin) ? pin[0] : pin;
    const studentName = Array.isArray(username) ? username[0] : username;
    const [myGroup, setMyGroup] = useState<Student[]>([]);

    useEffect(() => {
        if (!sessionCode || !studentName) return;

        const unsub = onSnapshot(
            doc(db, "sessions", sessionCode),
            (snapshot) => {
                const data = snapshot.data();
                if (!data?.groups) return;

                const groups = data.groups;
                for (let group of groups)
                {
                    const found = group.find(
                        (student:Student) => student.username === studentName
                    );
                    if (found)
                    {
                        setMyGroup(group);
                        break;
                    }
                }
            }
        );
        return unsub;
    }, [sessionCode, studentName]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Group</Text>
            {myGroup.length === 0 ? (
                <Text style={styles.student}>Waiting for group assignment</Text>
            ) : (
            myGroup.map((student, index) => (
                <Text key={index} style={styles.student}>{student.username}</Text>
            ))
            )}
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
    student: {
        color: '#FBCA17',
        fontSize: 36,
        textAlign: 'center',
        marginBottom: 36,
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