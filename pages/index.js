// init your index.js
import React from "react";
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { categories } from "../info/categories";
import { writeLS } from "../utils/localstorage";


function index() {
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h1>Тест Української Армії</h1>
                <h6>
                    Тест для підбору напрямку та спеціальності в Українській Армії. Усі дані будуть зашифровані та достіпні лише Вам, при надані паролю.
                </h6>
                <Link href={`/test/${categories[0]}`} onClick={
                    () => {
                        writeLS('answers', {});
                    }
                }>
                    Почати тест
                </Link>

            </div>
        </div>
    );
}

export default index;