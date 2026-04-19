import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type Student = {
    username: string;
}

export default function GroupScreen() {
    const { pin } = useLocalSearchParams();
    const sessionCode = Array.isArray(pin) ? pin[0] : pin;
    // const studentName = Array.isArray(username) ? username[0] : username;
    const [groups, setGroups] = useState<Student[][]>([]);

    useEffect(() => {
        if (!sessionCode) return;

        const unsub = onSnapshot(
            doc(db, "sessions", sessionCode),
            (snapshot) => {
                const data = snapshot.data();
                if (!data?.groups) return;
                
                const groupsMap = data.groups;
                const groupsArray = Object.keys(groupsMap).sort().map(key => groupsMap[key]);
                setGroups(groupsArray);
            }
        );
        return unsub;
    }, [sessionCode]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Groups</Text>
            {groups.map((group, groupIndex) => (
                <View key={groupIndex} style={styles.groupBox}>
                    <Text style={styles.group}>Group {groupIndex + 1}</Text>
                    {group.map((student, i) => (
                        <Text key={i} style={styles.student}>{student.username}</Text>
                    ))}
                </View>
            ))}
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
    group: {
        color: '#6D4DFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    groupBox: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#6D4DFF',
        padding: 12,
        marginBottom: 18
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