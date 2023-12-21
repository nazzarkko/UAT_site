import { connect } from "../../utils/mysql";
import { categories } from "../../info/categories";


export default async function handler(req, res) {
    const answers = req.body.answers;
    const pool = await connect();

    if (answers == undefined) {
        res.status(400).json({ error: "No answers provided" });
        return;
    }

    const summary = {};

    for (const category of categories) {
        const answer = answers[category];
        if (answer == undefined) {
            continue;
        }

        summary[category] = 0;

        let maximum_points = 0;
        let current_points = 0;

        if (answer.length == 0) {
            continue;
        }

        for (const answer_ of answer) {
            const [rows, fields] = await pool.execute(
                "SELECT answer FROM questions.questions WHERE idquestion = ?",
                [answer_.id]
            );

            const row = rows[0];
            if (row == undefined) {
                continue;
            }
            maximum_points += Math.max(...Object.values(row.answer));
            current_points += row.answer[answer_.answer];
        }

        summary[category] = current_points / maximum_points;

        console.log(summary[category])
    }

    console.log(summary);



    res.status(200).json(summary);
}
