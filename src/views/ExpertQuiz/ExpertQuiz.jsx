import React, { useEffect, useState } from 'react'
import QuizRenderer from '../../components/QuizRenderer/QuizRenderer';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

export default function ExpertQuiz() {

    const [subjects, setSubjects] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selecteSubject, setSelecteSubject] = useState({});


    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = () => {
        const userId = userService.getCurrentUserId()
        httpService.getRequest(URLS.GET_AVAILABLE_SUBJECTS, { userId }).subscribe(subjects => {
            setSubjects(subjects);
        })
    }

    const onSubjectSelect = (s) => {
        if (s.taken) {
            return miscService.handleError('Already Taken');
        }

        setSelecteSubject(s);

        httpService.getRequest(URLS.GET_EXPERT_QUIZ, null, { subjectId: s._id }).subscribe(questions => {
            setIsLoading(false);
            setQuestions(questions);
        });
    }

    return (
        <div className='expert-quiz-component'>

            {questions.length === 0 &&
                <>
                    <div className="expert-description-div">
                        <div className="app-card expert-description-card">
                            <div className="row">
                                <div className="col-md-7 description-col">
                                    <div className="description-wrapper">
                                        <h4 className='bold'>
                                            Verify Your Skills
                                        </h4>
                                        <p className='expert-description'>
                                            <span>
                                                Think You have got what it takes to be an expert in the subject? Well Let's find out.
                                            </span>

                                            <br />

                                            A typical assessment consists of 10 multiple choice questions and each question tests at least one concept or subskill.
                                            The questions must be completed in one session. You can view the full list of available courses below
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="expert-img-wrapper">
                                        <img className='expert-img' src="https://res.cloudinary.com/studentassister/image/upload/v1639145276/2895133_ktqlb5.jpg" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="available-subjects-div app-card subjects-card">
                        {
                            subjects.map(s => {
                                return <div className="single-subject">
                                    <div className="row">
                                        <div className="col-md-2 status-wrapper">
                                            <p className={"status " + (s.taken ? 'taken' : 'not-taken')}>
                                                {s.taken ? 'Cleared' : 'Not Taken'}
                                            </p>
                                        </div>

                                        <div className="col-md-6 name-wrapper">
                                            <p className="subject-name">
                                                {s.name}
                                            </p>
                                        </div>

                                        {!s.taken &&
                                            <div className="col-md-3 action-wrapper" onClick={() => { onSubjectSelect(s) }}>
                                                <button className='btn btn-primary take-test-btn'>Take Test</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </>
            }
            {questions.length > 0 && !isLoading &&
                <QuizRenderer questions={questions} subjectId={selecteSubject._id} isForExpert={true} />
            }


        </div>
    )
}
