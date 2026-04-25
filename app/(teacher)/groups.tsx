import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Groups</Text>
            <View style={styles.grid}>
            {groups.map((group, groupIndex) => (
                <View key={groupIndex} style={styles.groupBox}>
                    <Text style={styles.group}>Group {groupIndex + 1}</Text>
                    {group.map((student, i) => (
                        <View key={i} style={styles.studentRow}>
                            <View style={styles.studentAvatar}>
                                <Text style={styles.avatarText}>
                                    {student.username.slice(0,2).toUpperCase()}
                                </Text>
                            </View>
                            <Text style={styles.student}>{student.username}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#110934',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        flex: 1,
        backgroundColor: '#110934',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 16,
        minHeight: '100%'
    },
    title: {
        color: '#6D4DFF',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 36,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        width: '100%'
    },
    group: {
        color: '#6D4DFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center'
    },
    groupBox: {
        backgroundColor: '1a0f4a',
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#6D4DFF',
        padding: 16,
        width: '45%',
        minWidth: 160
    },
    student: {
        color: '#FBCA17',
        fontSize: 24
    },
    studentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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