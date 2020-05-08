import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'
import Question from "./Question/Question"

export default class ScrollForm extends Component {
  static propTypes = {
    enterToChangeQuestion: PropTypes.bool,
    goToQuestionCallback: PropTypes.func,
    onScrollEndCallback: PropTypes.func,
    passUpGoToQuestion: PropTypes.func,
    questions: PropTypes.array.isRequired,
    tabToChangeQuestion: PropTypes.bool,
  }

  static defaultProps = {
    enterToChangeQuestion: true,
    goToQuestionCallback: questionIndex => console.log("questionIndex",questionIndex),
    passUpGoToQuestion: goToQuestion => {},
    onScrollEndCallback: questionIndex => console.log("questionIndex",questionIndex),
    tabToChangeQuestion: true,
  }

  currentQuestionIndex = 0
  scrollTimeout = null

  componentDidMount() {
    this.props.passUpGoToQuestion(this.goToQuestion)
    this.goToQuestion(0) //initialize to first question
    window.addEventListener("scroll", this.onScroll)
    window.addEventListener("keydown", this.onKeyDown)
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll)
    window.removeEventListener("keydown", this.onKeyDown)
  }

  onScroll = () => {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(this.onScrollEnd, 100);
  }

  onScrollEnd = () => {
    this.props.onScrollEndCallback(this.currentQuestionIndex)
  }

  onKeyDown = e => {
    if(e.key==="Tab" && e.shiftKey && this.props.tabToChangeQuestion) { //SHIFT + TAB
      e.preventDefault()
      this.goToQuestion(this.currentQuestionIndex - 1) //go to previous question
    }
    else if(
      (e.key==="Enter" && this.props.enterToChangeQuestion) || //ENTER
      (e.key==="Tab" && this.props.tabToChangeQuestion) //TAB
    ) {
      e.preventDefault()
      this.goToQuestion(this.currentQuestionIndex + 1) //go to next question
    }
  }

  goToQuestion = (questionIndex) => {
    if(this.props.questions[questionIndex]) { //if the question index is valid
      if(this[this.getRefKeyFromIndex(questionIndex)]) { //if the ref for this question exists
        this[this.getRefKeyFromIndex(questionIndex)].scrollIntoView({ //scroll the element into view
          behavior: "smooth"
        })
        this.currentQuestionIndex = questionIndex //set the new question index

        this.props.goToQuestionCallback(questionIndex) //run the callback
      }
    }
  }

  getRefKeyFromIndex = index => `div${index}`

  render() {
    const {
      questions,
    } = this.props

    return (
      <div className={styles.questionsContainer}>
        {questions.map((q,i) =>
          <div key={i} ref={div => this[this.getRefKeyFromIndex(i)] = div}>
            <Question
              index={i}
              goToQuestion={this.goToQuestion}
              question={q}
            />
          </div>
        )}
      </div>
    )
  }
}
