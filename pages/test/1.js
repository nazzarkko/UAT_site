// init your index.js
import React from "react";
import styles from '../../styles/Test.module.css'
import Link from 'next/link'


function index() {
    const questions = [
        {
            "question": "Які з перелічених речей Ви б взяли з собою на пустинний острів?",
            "type": "choice",
            "options": [
                "Книгу",
                "Ніж",
                "Сірник",
                "Компас",
            ]
        }
    ]
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.title}>
                    Секція: Тіло
                </div>

                <div className={styles.questions}>
                    {questions.map((question, index) => {
                        return (
                            <div className={styles.question}>
                                <div className={styles.questionTitle}>
                                    {index + 1}. {question.question}
                                </div>
                                {question.options.map((option, index) => {
                                    return (
                                        <div className={styles.option}>
                                            <input type="radio" id={index} name="option" value={option} />
                                            <label for={index}>{option}</label>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
}

export default index;