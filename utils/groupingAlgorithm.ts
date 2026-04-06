export function generateGroups(students: any[], groupSize: number)
{
    const groups: any[][] = [];
    const numGroups = Math.ceil(students.length / groupSize);

    for (let i = 0; i < numGroups; i++)
    {
        groups.push([]);
    }

    students.sort((a, b) => b.leadership - a.leadership);
    
    // Sorts students according to leadership styles.
    let groupIndex = 0;
    for (let student of students)
    {
        groups[groupIndex].push(student);
        groupIndex = (groupIndex + 1) % numGroups;
    }
    return groups;
}