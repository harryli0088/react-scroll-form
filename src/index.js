import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'
import Question from "./Question/Question"

const QUESTION_HEIGHT = 500;
const TRANSITION_SECONDS = 1;

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
    goToQuestionCallback: questionIndex => {},
    onScrollEndCallback: questionIndex => {},
    passUpGoToQuestion: goToQuestion => {},
    tabToChangeQuestion: true,
  }

  state = {
    currentQuestionIndex: 0,
  }

  scrollTimeout = null

  componentDidMount() {
    this.props.passUpGoToQuestion(this.goToQuestion) //pass the function to the parent
    this.goToQuestion(0) //initialize to first question
  }


  onKeyDown = e => {
    if(e.key==="Tab" && e.shiftKey && this.props.tabToChangeQuestion) { //SHIFT + TAB
      e.preventDefault()
      this.goToQuestion(this.state.currentQuestionIndex - 1) //go to previous question
    }
    else if(
      (e.key==="Enter" && this.props.enterToChangeQuestion) || //ENTER
      (e.key==="Tab" && this.props.tabToChangeQuestion) //TAB
    ) {
      e.preventDefault()
      this.goToQuestion(this.state.currentQuestionIndex + 1) //go to next question
    }
  }

  onWheel = e => {
    console.log("wheel", e.deltaY)
    if(Math.abs(e.deltaY) > 200) {
      this.goToQuestion(this.state.currentQuestionIndex + Math.sign(e.deltaY))
    }
  }

  goToQuestion = (questionIndex) => {
    // console.log("questionIndex",questionIndex)
    if(this.props.questions[questionIndex]) { //if the question index is valid
      this.setState({
        currentQuestionIndex: questionIndex,
      })

      this.props.goToQuestionCallback(questionIndex) //run the callback
      setTimeout(this.props.onScrollEndCallback, TRANSITION_SECONDS*1000, questionIndex)
    }
  }

  touchStartY = null
  onTouchStart = e => {
    console.log("onTouchStart",e.touches[0].screenY)
    this.touchStartY = e.touches[0].screenY
  }

  onTouchMove = e => {
    if(typeof this.touchStartY === "number") {
      console.log("onTouchMove",e.touches[0].screenY)
      const difference = this.touchStartY - e.touches[0].screenY
      if(Math.abs(difference) > 10) {
        this.goToQuestion(this.state.currentQuestionIndex + Math.sign(difference))
        this.touchStartY = null
      }
    }
  }

  onTouchEnd = e => {
    console.log("onTouchEnd",e)
    this.touchStartY = null
  }

  render() {
    const {
      questions,
    } = this.props

    console.log("this.state.currentQuestionIndex", this.state.currentQuestionIndex)

    return (
      <div
        className={styles.questionsContainer}
        onKeyDown={this.onKeyDown}
        onWheel={this.onWheel}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        {questions.map((q,i) =>
          <div key={i} style={{
            height: QUESTION_HEIGHT,
            position: "absolute",
            top: QUESTION_HEIGHT * (i - this.state.currentQuestionIndex),
            left: 0,
            right: 0,
            transition: "1s",
          }}>
            <Question
              index={i}
              question={q}
            />
          </div>
        )}
      </div>
    )
  }
}
