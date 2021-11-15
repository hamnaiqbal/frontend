import { useState } from "react";
import URLS from "../../constants/api-urls";
import httpService from "../../services/httpservice";
import QuizRenderer from "../../components/QuizRenderer/QuizRenderer";
import miscService from "../../services/miscService";

const AttemptQuiz = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [questions, setQuestions] = useState([]);

    const fileUploadHandler = (event) => {
        event.preventDefault();
        if (event.target && event.target.files) {
            const file = event.target.files[0];

            // Limiting file size to 1MB
            if (file.size > 1_000_000) {
                miscService.handleError('File Size too big. Maximum File upload size is 1MB')
                return;
            }

            setIsLoading(true);
            httpService.postRequest(URLS.GENERATE_QUESTIONS, { file }, true, false).subscribe(questions => {
                setIsLoading(false);
                setIsLoaded(true);
                setQuestions(questions);
            });
        }
    };


    return (
        <div className="attempt-quiz-comp">
            {/* This will be displayed before the file is upladed */}
            {!isLoading && !isLoaded &&
                <div className="container">
                    <div className="row">
                        <div className="quiz-info-card row">
                            <div className="col-md-6 quiz-gen-content">
                                <h2>
                                    Generate a Quiz
                                </h2>

                                <br />

                                <p className="quiz-description">
                                    Powered by artificial intelligence and machine learning algorithms,
                                    We allow you to create quality quizzes and assessments within seconds and
                                    completely free.
                                </p>

                                <br />

                                <div className="quiz-uploader">
                                    <div className="btn btn-primary">
                                        <p>
                                            <i className="pi pi-upload"></i>
                                            Upload Your Notes Here
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        id="attachmentLink"
                                        className="form-control-file attachment-input"
                                        name="attachmentLink"
                                        accept="image/*, application/pdf"
                                        onChange={(e) => {
                                            fileUploadHandler(e);
                                        }}
                                    />
                                </div>

                            </div>
                            <div className="col-md-6 quiz-gen-image p-0">
                                <img src="/quiz-img.jpg" alt="Generate" />
                            </div>
                        </div>
                    </div>
                </div>}

            {/* This section will be displayed when the file is uploaded and the questions are being generated */}

            {isLoading && !isLoaded &&
                <div className="quiz-loading">
                    <i className="pi pi-loading"></i>
                    Quiz is Being Generated. Please Wait
                </div>
            }

            {/* This section will be generated when the questions have been generated */}

            {!isLoading && isLoaded && <QuizRenderer questions={questions}></QuizRenderer>}
        </div>
    );
};

export default AttemptQuiz;