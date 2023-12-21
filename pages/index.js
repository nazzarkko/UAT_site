// init your index.js
import React from "react";
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { categories } from "../info/categories";


function index() {
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <h1>Тест Української Армії</h1>
                <div>
                    Тест для підбору напрямку та спеціальності в Українській Армії. Усі дані будуть зашифровані та достіпні лише Вам, при надані паролю.
                </div>
                <Link href={`/test/${categories[0]}`}>
                    Почати тест
                </Link>

            </div>
        </div>
    );
}

export default index;