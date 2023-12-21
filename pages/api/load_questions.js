import { connect } from "../../utils/mysql";
import { categories } from "../../info/categories";


export default async function handler(req, res) {
    const section = req.query.section;
    const pool = await connect();

    if (section == undefined) {
        res.status(400).json({ error: "No section provided" });
        return;
    }

    if (categories.includes(section) == false) {
        res.status(401).json({ error: "Invalid section" });
        return;
    }

    const [rows_categories, fields_categories] = await pool.execute(
        "SELECT idquestion FROM questions.categories WHERE category = ?",
        [section]
    );

    const idquestions = rows_categories.map((row) => {
        return row.idquestion;
    });
    // cut to 10 questions
    idquestions.splice(10);

    const placeholders = idquestions.map(() => '?').join(', ');
    const query = `SELECT idquestion, question, answer FROM questions.questions WHERE idquestion IN (${placeholders})`;

    const [rows, fields] = await pool.execute(query, idquestions);

    const questions = rows.map((question) => {
        const answers = Object.keys(question.answer);
        return {
            id: question.idquestion,
            question: question.question,
            answer: answers,
        };
    });


    res.status(200).json(questions);
}
