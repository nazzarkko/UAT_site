import { connect } from "../../utils/mysql";
import { categories } from "../../info/categories";


export default async function handler(req, res) {
    const answers = req.body.answers;
    const pool = await connect();

    if (answers == undefined) {
        res.status(400).json({ error: "No answers provided" });
        return;
    }

    // const summary = {};

    // for (const category of categories) {
    //     const answer = answers[category];
    //     if (answer == undefined) {
    //         continue;
    //     }

    //     summary[category] = 0;

    //     let maximum_points = 0;
    //     let current_points = 0;

    //     if (answer.length == 0) {
    //         continue;
    //     }

    //     for (const answer_ of answer) {
    //         const [rows, fields] = await pool.execute(
    //             "SELECT answer FROM questions.questions WHERE idquestion = ?",
    //             [answer_.id]
    //         );

    //         const row = rows[0];
    //         if (row == undefined) {
    //             continue;
    //         }
    //         maximum_points += Math.max(...Object.values(row.answer));
    //         current_points += row.answer[answer_.answer];
    //     }

    //     summary[category] = current_points / maximum_points;

    //     console.log(summary[category])
    // }






    const summary = {};

    // Collect all question IDs from answers
    let questionIds = [];
    for (const category of categories) {
        const answer = answers[category];
        if (answer && answer.length > 0) {
            for (const answer_ of answer) {
                questionIds.push(answer_.id);
            }
        }
    }

    // Ensure unique question IDs
    questionIds = [...new Set(questionIds)];

    // Create placeholders for the query
    const placeholders = questionIds.map(() => '?').join(', ');
    const query = `SELECT idquestion, answer FROM questions.questions WHERE idquestion IN (${placeholders})`;

    // Perform a single SQL query to get all required data
    const [rows, fields] = await pool.execute(query, questionIds);

    // Create a map for quick access
    const answerMap = new Map(rows.map(row => [row.idquestion, row.answer]));

    // Calculate the summary
    for (const category of categories) {
        const answer = answers[category];
        if (!answer || answer.length == 0) {
            continue;
        }

        summary[category] = 0;
        let maximum_points = 0;
        let current_points = 0;

        for (const answer_ of answer) {
            const row = answerMap.get(answer_.id);
            if (row == undefined) {
                continue;
            }
            maximum_points += Math.max(...Object.values(row));
            current_points += row[answer_.answer] || 0;
        }

        if (maximum_points > 0) {
            summary[category] = current_points / maximum_points;
        } else {
            summary[category] = 0;
        }
    }




    res.status(200).json(summary);
}
