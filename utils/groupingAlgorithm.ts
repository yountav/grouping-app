import { questions } from "@/data/questions";

type Answers = Record<number, number>;

type StudentWScores = {
    username: string;
    answers: Answers;
    scores: Record<string, number>;
    compositeScore: number;
}

// Converts student answers into trait-based scores
function computeScores(answers: Answers): Record<string, number>
{
    const traitTotals: Record<string, number> = {};
    const traitCounts: Record<string, number> = {};

    for (const question of questions)
    {
        const rawScore = answers[question.id];
        if (rawScore == undefined) continue;

        // Reverses scores to handle negatve phrasing
        const value = question.reversed ? (6 - rawScore) : rawScore;

        traitTotals[question.trait] = (traitTotals[question.trait] ?? 0) + value;
        traitCounts[question.trait] = (traitCounts[question.trait] ?? 0) + 1;
    }

    // Converts totals into normalized scores on a scale from 0 to 1
    const scores: Record<string, number> = {};
    for (const trait in traitTotals)
    {
        const avg = traitTotals[trait] / traitCounts[trait];
        scores[trait] = (avg - 1) / 4;
    }
    return scores;
}

// Function to generate balanced groups based on trait weights
export function generateGroups(students: {username: string, answers: Answers}[], groupSize: number, weights?: Record<string, number>) : {username: string} [][]
{
    // Default trait weights
    const defaultWeights: Record<string, number> = {
        leadership: 0.30,
        skill: 0.30,
        organization: 0.20,
        extroversion: 0.10,
        stress: 0.05,
        creativity: 0.05
    };
    const resolvedWeights = weights ?? defaultWeights;

    // Computes scores and composite score for each student
    const numGroups = Math.ceil(students.length / groupSize);
    const scoredStudents: StudentWScores[] = students.map(s => {
        const scores = computeScores(s.answers);
        const composite = Object.entries(resolvedWeights).reduce((sum, [trait, w]) => {
            return sum + (scores[trait] ?? 0) * w;
        }, 0);
        return {...s, scores, compositeScore: composite};
    });

    // Sorts students from highest to lowest composite score
    scoredStudents.sort((a, b) => b.compositeScore - a.compositeScore);
    
    // Balances students strengths and weaknesses across groups
    const groups: StudentWScores[][] = Array.from({ length: numGroups }, () => []);
    scoredStudents.forEach((student, i) => {
        const row = Math.floor(i / numGroups);
        const col = row % 2 == 0 ? i % numGroups : numGroups - 1 - (i % numGroups);
        groups[col].push(student);
    });

    return groups.map(group =>
        group.map(s => ({username: s.username}))
    );
}