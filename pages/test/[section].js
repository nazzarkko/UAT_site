// init your index.js
import { useEffect, useState } from "react";
import styles from '../../styles/Test.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { writeLS, readLS } from "../../utils/localstorage";
import { categories, categories_ukr } from "../../info/categories";
import Header from "../components/Header";
import Checkbox from "react-custom-checkbox";

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
        setAnswers(newAnswers);

    };







    return (
        <div className={styles.main}>
            <Header />
            <div className={styles.container}>
                <div className={styles.title_category}>
                    {/* Секція: {category} */}
                    {categories.map((category, index) => (
                        <div key={index} className={styles.category}>
                            <div className={categories.indexOf(category) <= categories.indexOf(category1)
                                ? styles.active : styles.inactive}>
                                ✔
                            </div>
                            <div style={{ height: '100%' }}></div>
                            <div className={styles.category_name}>
                                {categories_ukr[category]}
                            </div>
                        </div>
                    ))}
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
                                            <div className={styles.optionRow}>
                                                <Checkbox
                                                    icon={
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="58" viewBox="0 -960 960 960" width="58"><path fill="var(--dark-white)" d="M379.154-258.309 168.616-468.846l32.615-32.23 177.923 177.923 379-379.384 32.614 32.614-411.614 411.614Z" /></svg>
                                                    }
                                                    style={{ backgroundColor: "white", border: "1px solid #000", padding: 5 }}
                                                    name="my-input"
                                                    checked={answers.find((answer) => answer.id == question.id && answer.answer == option) != undefined}
                                                    onChange={
                                                        () => handleOptionChange(question.id, option)
                                                    }
                                                    labelStyle={{ marginLeft: 5, userSelect: "none" }}
                                                />
                                                <label htmlFor={uniqueId} className={styles.option} key={index_}>
                                                    {option}
                                                </label>
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
