import { questions } from "@/data/questions";

type Answers = Record<number, number>;

type StudentWScores = {
    username: string;
    answers: Answers;
    scores: Record<string, number>;
    compositeScore: number;
}

function computeScores(answers: Answers): Record<string, number>
{
    const traitTotals: Record<string, number> = {};
    const traitCounts: Record<string, number> = {};

    for (const question of questions)
    {
        const rawScore = answers[question.id];
        if (rawScore == undefined) continue;

        const value = question.reversed ? (6 - rawScore) : rawScore;

        traitTotals[question.trait] = (traitTotals[question.trait] ?? 0);
        traitCounts[question.trait] = (traitCounts[question.trait] ?? 0);
    }

    const scores: Record<string, number> = {};
    for (const trait in traitTotals)
    {
        const avg = traitTotals[trait] / traitCounts[trait];
        scores[trait] = (avg - 1) / 4;
    }
    return scores;
}

function compositeScore(scores: Record<string, number>) : number
{
    const weights: Record<string, number> = {
        leadership: 0.30,
        skill: 0.30,
        organization: 0.20,
        extroversion: 0.10
    };
    return Object.entries(weights).reduce((sum, [trait, w]) => {
        return sum + (scores[trait] ?? 0) * w;
    }, 0);
}

export function generateGroups(students: {username: string, answers: Answers}[], groupSize: number) : {username: string} [][]
{
    const numGroups = Math.ceil(students.length / groupSize);
    const scoredStudents: StudentWScores[] = students.map(s => {
        const scores = computeScores(s.answers);
        return {...s, scores, compositeScore: compositeScore(scores)};
    })

    scoredStudents.sort((a, b) => b.compositeScore - a.compositeScore);
    
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