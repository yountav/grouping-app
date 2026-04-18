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
                await updateDoc(doc(db, "sessions", sessionCode, "students", studentName),
                {
                    finished: true,
                    answers: updatedAnswers
                });
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
            <Text style={styles.questionNumber}>Question {currentQuestion + 1} / {questions.length}</Text>
            <Text style={styles.questionText}>{question.text}</Text>

            <View style={styles.answers}>
                <Pressable style={styles.button} onPress={() => selectAnswer(1)}>
                    <Text style={styles.buttonText}>Strongly Disagree</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => selectAnswer(2)}>
                    <Text style={styles.buttonText}>Disagree</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => selectAnswer(3)}>
                    <Text style={styles.buttonText}>Neither Agree or Disagree</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => selectAnswer(4)}>
                    <Text style={styles.buttonText}>Agree</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => selectAnswer(5)}>
                    <Text style={styles.buttonText}>Strongly Agree</Text>
                </Pressable>
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
});