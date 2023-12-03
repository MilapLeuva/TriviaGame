import React, { Fragment, useEffect, useRef, useState } from 'react';

const Trivia = () => {

    const [correctAnswer, setCorrectAnswer] = useState("");
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [showInCorrectAnswer, setShowInCorrectAnswer] = useState(false);
    const [question, setQuestion] = useState([]);
    const [allOptions, setAllOptions] = useState([]);
    const [correctPoints, setCorrectPoints] = useState(0);
    const [incorrectPoints, setIncorrectPoints] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [selectedOption, setSelectedOption] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [result, setResult] = useState(false);
    const [next, setNext] = useState(false);
    const [validation, setValidation] = useState(false);

    const first = useRef(true);

    const Options = async (incorrectOptions, correctOptions) => {
        let allOptions = [];
        incorrectOptions.map((item) => {
            item.incorrect_answers.map((incorrectAnswer) => {
                allOptions.push(incorrectAnswer)
            });
        });
        allOptions.push(correctOptions);
        allOptions.sort(() => Math.random() - 0.5);
        setAllOptions(allOptions);
    }

    let API = "https://opentdb.com/api.php?amount=1";

    const fetchApiData = async (url) => {
        setLoading(true)
        try {
            const res = await fetch(url);
            const responseData = await res.json();

            setQuestion(responseData.results);
            setCorrectAnswer(responseData.results[0].correct_answer);

            await Options(responseData.results, responseData.results[0].correct_answer);
            setLoading(false);
        }
        catch (error) {
            fetchApiData(API);
        }
    }

    const VerifyAnswer = (selectedAnswer) => {
        if (selectedAnswer === undefined || selectedAnswer === null || selectedAnswer === "") {
            setValidation(true);
            setNext(false);
            return;
        }
        if (selectedAnswer === correctAnswer) {
            setShowCorrectAnswer(true);
            setCorrectPoints(correctPoints + 1);
        } else {
            setShowInCorrectAnswer(true);
            setIncorrectPoints(incorrectPoints + 1);
        }
        setNext(true);
    }

    const NextQuestion = () => {
        if (questionNumber < 10) {
            fetchApiData(API);
            setSelectedOption();
            setQuestionNumber(questionNumber + 1);
            setShowInCorrectAnswer(false);
            setShowCorrectAnswer(false);
            setSubmit(false);
        } else {
            setResult(true);
        }
        setNext(false);
    }

    const Submit = (answer) => {
        setValidation(false)
        setSubmit(true);
        setSelectedOption(answer);
    }

    const removeCharacters = (question) => {
        return question.replace(/(&quot\;)/g, "\"").replace(/(&rsquo\;)/g, "\"").replace(/(&#039\;)/g, "\'").replace(/(&amp\;)/g, "\"");
    }

    useEffect(() => {
        if (first.current) {
            fetchApiData(API);
            first.current = false;
        }
        setSelectedOption();
        setShowCorrectAnswer(false);
        setShowInCorrectAnswer(false);
        setSubmit(false);
        setValidation(false);
    }, []);

    return (
        <Fragment>
            {result === true ? (
                <div className="App">
                    <header className="App-header">
                        <div>
                            Result of Quiz
                        </div>
                        <br />
                        <div>
                            Total Questions Served : {questionNumber} <br />
                            Total Correct Questions : {correctPoints} <br />
                            Total Incorrect Questions : {incorrectPoints} <br />
                        </div>
                    </header>
                </div>
            ) : (
                <div className="App">
                    <header className="App-header">
                        {loading ? "Question Loading..." : <div>
                            {question.length > 0 && <div>
                                Question No : {questionNumber}
                            </div>}
                            <br />

                            {question.map((Data, index) =>
                                <div key={index}>
                                    <div>
                                        {removeCharacters(Data.question)}
                                    </div>
                                    <br />
                                    <div>
                                        {allOptions.map((answer, index) =>
                                            <div key={index}>
                                                <button className='selectbtn' key={index} onClick={() => Submit(answer)} >
                                                    {removeCharacters(answer)}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                            {validation === true &&
                                <div className="divmain">
                                    Please select at-least one option.
                                </div>
                            }
                            {submit === true &&
                                <Fragment>
                                    <br />
                                    <div>
                                        Your selected option is : {selectedOption}
                                    </div>
                                    <br/>
                                    {showCorrectAnswer === true &&
                                        <div>
                                            Your selected option is correct
                                        </div>
                                    }
                                    <br />
                                    {showInCorrectAnswer === true &&
                                        <div>
                                            Sorry your selected option is wrong and correct answer is : {correctAnswer}
                                        </div>
                                    }
                                    <br />
                                    {next === true &&
                                        <div>
                                            <button type="button" className="btn btn-primary" onClick={() => NextQuestion()}>
                                                Next
                                            </button>
                                        </div>
                                    }
                                </Fragment>
                            }
                            {next === false &&
                                <div className="divmain">
                                    <button type="button" className="btn btn-primary" onClick={() => VerifyAnswer(selectedOption)}>
                                        Submit
                                    </button>
                                </div>
                            }
                        </div>
                        }
                    </header>
                </div>
            )
            }
        </Fragment>
    )
}

export default Trivia
