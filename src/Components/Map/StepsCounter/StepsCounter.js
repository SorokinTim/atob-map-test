import React, {Component} from "react";
import s from './StepsCounter.module.css';

export default class StepsCounter extends Component {
    constructor(props) {
        super(props);
        this.previousBtnRef = React.createRef();
        this.nextBtnRef = React.createRef();
        // this.finishBtnRef = React.createRef();
        this.contentRef = React.createRef();
        this.bullets = [];
    }

    componentDidMount() {

        const previousBtn = this.previousBtnRef.current;
        const nextBtn = this.nextBtnRef.current;
        // const finishBtn = this.finishBtnRef.current;
        const content = this.contentRef.current;

        const MAX_STEPS = 4;
        let currentStep = 1;

        nextBtn.addEventListener('click', () => {
            this.bullets[currentStep - 1].classList.add(s.completed);
            currentStep += 1;
            previousBtn.disabled = false;
            if (currentStep === MAX_STEPS) {
                nextBtn.disabled = true;
                // finishBtn.disabled = false;
            }
            content.innerText = `Введите маршрут`;
        });


        previousBtn.addEventListener('click', () => {
            this.bullets[currentStep - 2].classList.remove(s.completed);
            currentStep -= 1;
            nextBtn.disabled = false;
            // finishBtn.disabled = true;
            if (currentStep === 1) {
                previousBtn.disabled = true;
            }
            content.innerText = `Введите маршрут`;
        });
    }

    render() {
        return (
            <div className={s.container}>
                <div className={s.stepProgressBar}>
                    <div className={s.step}>
                        <div className={s.bullet} ref={(ref) => this.bullets.push(ref)}>1</div>
                    </div>
                    <div className={s.step}>
                        <div className={s.bullet} ref={(ref) => this.bullets.push(ref)}>2</div>
                    </div>
                    <div className={s.step}>
                        <div className={s.bullet} ref={(ref) => this.bullets.push(ref)}>3</div>
                    </div>
                    <div className={s.step}>
                        <div className={s.bullet} ref={(ref) => this.bullets.push(ref)}>4</div>
                    </div>
                </div>
                <div>
                    <p ref={this.contentRef} className={s.stepInfoHeader}>Введите маршрут</p>
                    <div>
                        {this.props.children}
                    </div>
                    <button ref={this.previousBtnRef} className={`${s.btnStepper} ${s.btnPrevStepper}`}>Назад</button>
                    <button ref={this.nextBtnRef} className={`${s.btnStepper} ${s.btnNextStepper}`}>Далее</button>
                    {/*<button ref={this.finishBtnRef}>Finish</button>*/}
                </div>
            </div>
        )
    }
}