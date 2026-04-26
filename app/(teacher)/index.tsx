import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const TRAITS = [
    { key: 'leadership', label: 'Leadership' },
    { key: 'skill', label: 'Skill' },
    { key: 'organization', label: 'Organization' },
    { key: 'stress', label: 'Stress Tolerance' },
    { key: 'extroversion', label: 'Extroversion' },
    { key: 'creativity', label: 'Creativity' }
];

const DEFAULT_WEIGHTS: Record<string, number> = {
    leadership: 30,
    skill: 30,
    organization: 20,
    extroversion: 10,
    stress: 5,
    creativity: 5
};

export default function HomeSceen()
{
    const [gameCode, setGameCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());
    const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
    const total = Object.values(weights).reduce((a,b) => a + b, 0);
    const updateWeight = (key: string, value: number) => {
        setWeights(prev => ({
            ...prev,
            [key]: value
        }));
    };
    
    const createSession = async () => {
        try {
            const normWeights: Record<string, number> = {};
            for (const key in weights)
            {
                normWeights[key] = weights[key] / 100;
            }

            await setDoc(doc(db, "sessions", gameCode), {
                createdAt: Date.now(),
                status: "lobby",
                weights: normWeights
            });

            router.replace({
                pathname: "/(teacher)/lobby",
                params: { code: gameCode }
            });
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>SkillSync</Text>
            <View style={styles.pinCard}>
                <Text style={styles.pinLabel}>Class Pin</Text>
                <Text style={styles.pin}>{gameCode}</Text>
            </View>

            <Text style={styles.sectionTitle}>Trait Weights</Text>
            <Text style={styles.sectionText}>Adjust how much each trait influences grouping algorithm</Text>

            <Pressable style={styles.button} onPress={createSession}>
                <Text style={styles.buttonText}>Start</Text>
            </Pressable>
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
        fontFamily: 'Futura',
        fontWeight: 'bold',
        marginBottom: 36,
    },
    text: {
        color: '#FCCB1A',
        fontSize: 20,
        marginBottom: 20,
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
        width: '80%',
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
    sectionTitle: {
        color: '#6D4DFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4
    },
    sectionText: {
        color: '#FCCB1A',
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 16
    }
});