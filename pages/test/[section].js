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

        loadQuestions(section);
    }, [router.query.section]);

    const [answers, setAnswers] = useState({});


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
                answer: answers[key],
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
        setAnswers({
            ...answers,
            [questionIndex]: selectedOption,
        });
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
                                                    type="radio"
                                                    id={uniqueId}
                                                    name={`question-${index}`}
                                                    value={option}
                                                    onChange={() => handleOptionChange(index, option)}
                                                    checked={answers[index] === option}
                                                    required
                                                />
                                                <label htmlFor={uniqueId}>{option}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className={styles.submit} type="submit">Submit</button>
                </form>


            </div>
        </div>
    );
}

export default index;