import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './BottomForm.module.css'; // Import scoped styles
import { baseURL } from '../common/SummaryApi';
import toast from 'react-hot-toast';

const BottomForm = ({ productId, userId }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [ state , setState] = useState(0)
    const [questions , setQuestions] = useState([])
    const [answers , setAnswers] = useState([])

    async function getFormData() 
    {
        let data = await fetch(`${baseURL}/api/survey/get-form-details`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({productId:productId})
        })    
        console.log(data)
        data = await data.json()
        console.log(data)
        setQuestions(data?.message[0]?.form?.questions)
        if(data?.message[0]?.form?.questions.length == 0)
        {
            setIsVisible(false)
        }
    }

    function setAnswer(e, question) {
        e.preventDefault();
        e.stopPropagation();
    
        setAnswers((prev) => {
            const updatedAnswers = [...prev];
            const index = updatedAnswers.findIndex((ans) => ans.question === question);
            if (index !== -1) {
                updatedAnswers[index].answer = e.target.innerText; // Update existing
            } else {
                updatedAnswers.push({ question: question, answer: e.target.innerText }); // Add new
            }
            return updatedAnswers;
        });
        setState(state+1);


        console.log(answers)
    }

    useEffect(()=>{
        getFormData()
    },[])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response = await fetch(`${baseURL}/api/survey/submit-survey-answer`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    productId:productId,
                    userId:userId,
                    userDetails:{},
                    responses:answers
                })
            })
            
            if (response.status === 200) {
                response = await response.json()
                toast.success(response.message)
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting.');
        }
    };

    return (
        <div className={`${styles.formContainer} ${isVisible ? styles.show : ''}`}>
            <div className={styles.formOverlay} onClick={() => setIsVisible(false)} />
            <div className={styles.formContent}>
                <button className={styles.closeButton} onClick={(e) => {handleSubmit(e);
                    setIsVisible(false) }  }>
                    X
                </button>


                {
                    state==-1&&<div>
                    <h3>Submit Your Information</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                        <button type="submit" className={styles.submitButton}>
                            Submit
                        </button>
                    </form>
                </div>
                }


                {
                    questions?.map((question,idx)=>(idx == state)&&
                    <div className={styles.questionContainer} key={idx}>
                        <p className={styles.question}>{question.question}</p>
                        {question.type === 'multiple-choice' ? (
                            <div className={styles.optionsContainer}>
                                {question.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={styles.optionButton}
                                        onClick={(e) => setAnswer(e, question.question)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder="Enter your answer"
                                className={styles.textInput}
                                onChange={(e) => setAnswer(e, question.question)}
                            />
                        )}
                    </div>
                    )
                }


            </div>
        </div>
    );
};




export default BottomForm;
