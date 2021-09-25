
import { useState } from "react";
import URLS from "../../constants/api-urls";
import httpService from "../../services/httpservice";
import miscService from "../../services/miscService";

const QuizRenderer = (props) => {

    const { questions } = props;

    const [answerSelected, setAnswerSelected] = useState({});

    const setAnswer = (question, answer) => {
        const temp = { ...answerSelected };
        temp[question] = answer;
        setAnswerSelected(temp);
    }

    const onQuizSubmit = () => {
        let questionsToSend = [...questions];
        questionsToSend.forEach((q, i) => {
            questionsToSend[i].selected = answerSelected[i];
        });
        httpService.postRequest(URLS.CHECK_QUESTIONS, { questions: questionsToSend }).subscribe(res => {
            // miscService.handleSuccess(res);
            // console.log(res);
            miscService.handleSuccess(`You have received ${res.points} out of ${res.total}`)
        })
    }


    const renderQuestions = () => {
        return questions.map((q, i) => {
            return <div className="single-question-wrapper quiz-card" key={i}>
                <div className="quiz-card-header">
                    Question No. {i + 1}
                </div>
                <div className="quiz-card-content">
                    <p className="question-statement">
                        {q.question}
                    </p>
                    <hr />
                    <div className="question-options-wrapper text-left">
                        {
                            q.options.map((op, j) => {
                                return <div key={j} onClick={() => { setAnswer(i, op) }} className="col-md-6">
                                    <div className={"question-option-select " + (answerSelected[i] === op ? 'selected' : '')}>
                                        {op}
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        })
    }

    return (
        questions && questions.length > 0 && <div className="quiz-renderer-comp">
            {renderQuestions()}

            <div className="submit-row row">
                <div className="col-md-12">
                    <button onClick={onQuizSubmit} className="form-control btn btn-primary">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default QuizRenderer