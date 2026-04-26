import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { questions } from "../../data/questions";

export default function QuizScreen() {
    const { pin, username } = useLocalSearchParams();
    const sessionCode = Array.isArray(pin) ? pin[0] : pin;
    const studentName = Array.isArray(username) ? username[0] : username;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const question = questions[currentQuestion];

    // Function called when user selects an answer
    // Updates answer for current questions and moves
    // forward after questions are answered
    const selectAnswer = async (value: number) => {
        const updatedAnswers = {
            ...answers,
            [question.id]: value
        };
        setAnswers(updatedAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } 
        else {
            console.log("Quiz finished!", updatedAnswers);
            try {
                // Saves each answered question to Firestore
                await updateDoc(doc(db, "sessions", sessionCode, "students", studentName),
                {
                    finished: true,
                    answers: updatedAnswers
                });
                // Navigates to waiting screen after student finishes quiz
                router.replace({
                    pathname: "/(student)/waiting_screen",
                    params: { pin: sessionCode, username: studentName }
                });
            } catch (error) {
                console.log("Error saving results: ", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Displays Progress Bar */}
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, {width: `${((currentQuestion+1)/questions.length)*100}%`}]}/>
            </View>
            <Text style={styles.questionNumber}>Question {currentQuestion + 1} / {questions.length}</Text>
            <Text style={styles.questionText}>{question.text}</Text>

            {/* Displays Answer Scale from Strongly Disagree to Strongly Agree */}
            <View style={styles.scaleRow}>
                {[1,2,3,4,5].map(v => (
                    <Pressable key={v} style={styles.scaleButton} onPress={() => selectAnswer(v)}>
                        <Text style={styles.scaleBtnText}>{v}</Text>
                    </Pressable>
                ))}
            </View>
            <View style={styles.scaleLabel}>
                <Text style={styles.scaleLabelText}>Strongly Disagree</Text>
                <Text style={styles.scaleLabelText}>Strongly Agree</Text>
            </View>
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
    questionText: {
        color: '#FBCA17',
        fontSize: 36,
        textAlign: 'center',
        marginBottom: 36,
    },
    questionNumber: {
        color: '#FBCA17',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    answers: {
        width: '100%',
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
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: '#1a0f4a',
        borderRadius: 2,
        marginBottom: 20
    },
    progressFill: {
        height: 4,
        backgroundColor: '#6D4DFF',
        borderRadius: 2
    },
    scaleRow: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        marginBottom: 8
    },
    scaleButton: {
        flex: 1,
        backgroundColor: '#1a0f4a',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2a1860'
    },
    scaleBtnText: {
        color: '#FBCA17',
        fontSize: 16,
        fontWeight: '600'
    },
    scaleLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    scaleLabelText: {
        color: '#6D4DFF',
        fontSize: 18,
        opacity: 0.6
    }
});