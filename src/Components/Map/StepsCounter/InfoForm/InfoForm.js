import React from "react";
import s from './InfoForm.module.css';

export default function InfoForm() {
    return (
        <div>
            <div className={s.inputContainer}>
                <i className="fas fa-cube"/>
                <input type="text" placeholder='Search' className={s.input}/>
            </div>
            <div className={s.inputContainer}>
                <i className="fas fa-cube"/>
                <input type="text" placeholder='Search' className={s.input}/>
            </div>
        </div>
    )
}