// init your index.js
import { useEffect, useState } from "react";
import styles from '../../styles/Test.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { writeLS, readLS } from "../../utils/localstorage";
import { categories, categories_ukr } from "../../info/categories";


function index() {

    const [questions, setQuestions] = useState([]);
    const [category, setCategory] = useState('');
    const [category1, setCategory1] = useState('');
    const [answers, setAnswers] = useState([]);

    const router = useRouter();

    const loadQuestions = async (section) => {
        const res = await fetch('/api/load_questions?section=' + section).catch((err) => {
            console.log(err);
        });
        const newQuestions = await res.json();
        // for (const question of newQuestions) {
        //     question.answer = Object.keys(question.answer);
        // }
        setQuestions(newQuestions);

        // from localstorage load previous answers
        const answersFromLS = readLS('answers') || [];
        const answers_ = answersFromLS[section] || [];
        // replace with a list of answers
        // if (answers.length != 0) {
        //     console.log(answers);
        //     const answers_ = answers.map((answer) => answer.answer);
        //     setAnswers(answers_);
        // } else {
        //     setAnswers({});
        // }

        // console.log(answers);


        setAnswers(answers_);

        // answers_ format is [{id: ..., answer: ...}, ...]

        console.log(answers_);
    }

    useEffect(() => {
        if (router.query.section == undefined) {
            return;
        }

        const section = router.query.section;
        if (section == undefined) {
            router.push('/');
        } else if (categories.includes(section) == false) {
            router.push('/');
        }

        setCategory(categories_ukr[section] || section);
        setCategory1(section);

        loadQuestions(section);
    }, [router.query.section]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitted Answers:', answers);


        // save answers to localstorage
        const answersFromLS = readLS('answers') || {};
        // const answersFromLS = {};
        const answers_with_id = Object.keys(answers).map((key, index) => {
            console.log(questions[key])
            return {
                id: questions[key].id,
                answer: answers[key].answer,
            };
        });
        answersFromLS[router.query.section] = answers_with_id;
        writeLS('answers', answersFromLS);

        // redirect to next section
        const sectionIndex = categories.indexOf(router.query.section);
        if (sectionIndex == -1) {
            return;
        }
        if (sectionIndex == categories.length - 1) {
            window.location.href = '/test/result';
            return;
        }
        const nextSection = categories[sectionIndex + 1];
        if (nextSection != undefined) {
            window.location.href = `/test/${nextSection}`;
        }

        // Here you can add logic to send data to a server or process it
    };



    // Function to handle option selection
    const handleOptionChange = (questionIndex, selectedOption) => {
        const newAnswers = [...answers];
        // go through the array of answers
        for (let i = 0; i < newAnswers.length; i++) {
            if (newAnswers[i].id == questionIndex) {
                newAnswers[i].answer = selectedOption;
                setAnswers(newAnswers);
                return;
            }
        }
        // if not found, add a new answer
        newAnswers.push({ id: questionIndex, answer: selectedOption });

    };




    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.title}>
                    Секція: {category}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.questions}>
                        {questions.map((question, index) => (
                            <div key={index} className={styles.question}>
                                <div className={styles.questionTitle}>
                                    {index + 1}. {question.question}
                                </div>
                                <div className={styles.options}>
                                    {question.answer.map((option, index_) => {
                                        const uniqueId = `question-${index}-option-${index_}`;
                                        return (
                                            <div key={uniqueId} className={styles.option}>
                                                <input
                                                    type="checkbox"
                                                    id={uniqueId}
                                                    name={`question-${index}`}
                                                    value={option}
                                                    onChange={() => handleOptionChange(question.id, option)}
                                                    checked={answers.find((answer) => answer.id == question.id && answer.answer == option) != undefined}
                                                    required
                                                />
                                                <label htmlFor={uniqueId}>{option}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        <div className={styles.navigation}>
                            {categories.indexOf(category1) == 0 ? (
                                <button className={styles.submit} type="submit">Далі</button>
                            ) : (categories.indexOf(category1) == categories.length - 1 ?
                                <button className={styles.submit} type="submit">Завершити</button>
                                :
                                <>
                                    <button className={styles.back} onClick={() => {
                                        window.location.href = `/test/${categories[categories.indexOf(category1) - 1]}`;
                                    }}>Назад</button>
                                    <button className={styles.submit} type="submit">Далі</button>
                                </>
                            )
                            }
                        </div>
                    </div>

                </form>


            </div>
        </div>
    );
}

export default index;