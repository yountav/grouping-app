import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

// Traits used in grouping algorithm
const TRAITS = [
    { key: 'leadership', label: 'Leadership' },
    { key: 'skill', label: 'Skill' },
    { key: 'organization', label: 'Organization' },
    { key: 'stress', label: 'Stress Tolerance' },
    { key: 'extroversion', label: 'Extroversion' },
    { key: 'creativity', label: 'Creativity' }
];

// Default weights used in grouping algorithm
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
    // Sets group size with a default of 4
    const [groupSize, setGroupSize] = useState(4);

    // Generates random 6-digit code
    const [gameCode, setGameCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());
    
    // Sets and updates each trait weight and ensures all totals to 100%
    const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
    const total = Object.values(weights).reduce((a,b) => a + b, 0);
    const updateWeight = (key: string, value: number) => {
        setWeights(prev => ({
            ...prev,
            [key]: value
        }));
    };
    
    // Creates a new session in Firestore
    const createSession = async () => {
        try {
            // Normalizes weights to decimals from scale of 0 to 1
            const normWeights: Record<string, number> = {};
            for (const key in weights)
            {
                normWeights[key] = weights[key] / 100;
            }

            // Creates session document
            await setDoc(doc(db, "sessions", gameCode), {
                createdAt: Date.now(),
                status: "lobby",
                weights: normWeights,
                groupSize: groupSize
            });
            // Navigates to lobby screen
            router.replace({
                pathname: "/(teacher)/lobby",
                params: { code: gameCode }
            });
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>SkillSync</Text>
            <View style={styles.pinCard}>
                <Text style={styles.pinLabel}>Class Pin</Text>
                <Text style={styles.pin}>{gameCode}</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Group Size</Text>
            <Text style={styles.groupSize}>{groupSize} students per group</Text>
            <View style={styles.adjustRow}>
                <Pressable style={styles.adjustButton} onPress={() => setGroupSize(Math.max(1, groupSize - 1))}>
                    <Text style={styles.adjustText}>-</Text>
                </Pressable>
                <Pressable style={styles.adjustButton} onPress={() => setGroupSize(groupSize + 1)}>
                    <Text style={styles.adjustText}>+</Text>
                </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Set Trait Weights</Text>
            <Text style={styles.sectionText}>Adjust how much each trait influences grouping algorithm</Text>

            <View style={styles.totalLabel}>
                <Text style={[
                    styles.totalText,
                    total !== 100 && styles.totalWarning
                ]}>Total: {total}% {total !== 100 ? `Must equal 100%` : '\u2713'}</Text>
            </View>

            {TRAITS.map(trait => (
                <View key={trait.key} style={styles.slider}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.traitLabel}>{trait.label}</Text>
                        <Text style={styles.traitValue}>{weights[trait.key]}%</Text>
                    </View>

                    <View style={styles.adjustRow}>
                        <Pressable style={styles.adjustButton} onPress={() => updateWeight(trait.key, Math.max(0, weights[trait.key] - 5))}>
                            <Text style={styles.adjustText}>-</Text>
                        </Pressable>
                        <Pressable style={styles.adjustButton} onPress={() => updateWeight(trait.key, Math.min(100, weights[trait.key] + 5))}>
                            <Text style={styles.adjustText}>+</Text>
                        </Pressable>
                    </View>
                </View>
            ))}

            <Pressable style={[styles.button, total !== 100 && styles.buttonDisabled]} onPress={createSession} disabled={total !== 100}>
                <Text style={styles.buttonText}>Start</Text>
            </Pressable>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#110934'
    },
    scrollContent: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 16
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
    buttonDisabled: {
        backgroundColor: '#1a0f4a',
        opacity: 0.6
    },
    sectionTitle: {
        color: '#6D4DFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 16
    },
    sectionText: {
        color: '#FCCB1A',
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 16
    },
    totalLabel: {
        backgroundColor: '#1a0f4a',
        borderRadius: 8,
        padding: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '2a1860'
    },
    totalText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '700'
    },
    totalWarning: {
        color: '#ff6b6b'
    },
    slider: {
        width: '100%',
        marginBottom: 20
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    traitLabel: {
        color: '#F7F0D4',
        fontSize: 14,
        fontWeight: '600'
    },
    traitValue: {
        color: '#6D4DFF',
        fontSize: 14,
        fontWeight: '700'
    },
    adjustRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    adjustButton: {
        backgroundColor: '#3214B8',
        padding: 10,
        borderRadius: 6,
        width: 60,
        alignItems: 'center'
    },
    adjustText: {
        color: '#FBCA17',
        fontSize: 18,
        fontWeight: 'bold'
    },
    groupSize: {
        color: '#F7F0D4',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16
    }
});