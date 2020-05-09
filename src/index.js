import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'
import Question from "./Question/Question"

const QUESTION_HEIGHT = 500

export default class ScrollForm extends Component {
  static propTypes = {
    enterToChangeQuestion: PropTypes.bool,
    goToQuestionCallback: PropTypes.func,
    onScrollEndCallback: PropTypes.func,
    passUpGoToQuestion: PropTypes.func,
    questions: PropTypes.array.isRequired,
    tabToChangeQuestion: PropTypes.bool,
    touchScrollThreshold: PropTypes.number,
    transitionSeconds: PropTypes.number,
    wheelScrollThreshold: PropTypes.number,
  }

  static defaultProps = {
    enterToChangeQuestion: true,
    goToQuestionCallback: questionIndex => {},
    onScrollEndCallback: questionIndex => {},
    passUpGoToQuestion: goToQuestion => {},
    tabToChangeQuestion: true,
    touchScrollThreshold: 10,
    transitionSeconds: 1,
    wheelScrollThreshold: 200,
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

  canScroll = true //only allow the user to increment by one question per wheel
  onWheel = e => {
    if(Math.abs(e.deltaY) > this.props.wheelScrollThreshold) { //if we have exceeded the threshold
      if(this.canScroll) { //if we are allowed to scroll
        this.goToQuestion(this.state.currentQuestionIndex + Math.sign(e.deltaY))
        this.canScroll = false //we are not allowed to scroll anymore
      }
    }
    else { //else the wheel just started
      this.canScroll = true //we can scroll again
    }
  }

  touchStartY = null
  onTouchStart = e => {
    this.touchStartY = e.touches[0].screenY //set the starting y position
  }
  onTouchMove = e => {
    if(typeof this.touchStartY === "number") { //if touch start y is still a number
      const difference = this.touchStartY - e.touches[0].screenY //get the pixel difference between the starting y position and current
      if(Math.abs(difference) > this.props.touchScrollThreshold) { //if the difference is big enough
        this.goToQuestion(this.state.currentQuestionIndex + Math.sign(difference))
        this.touchStartY = null //set the start y to null so that one swipe only increments by one question
      }
    }
  }
  onTouchEnd = e => {
    this.touchStartY = null //set the start y to null
  }


  goToQuestion = (questionIndex) => {
    // console.log("questionIndex",questionIndex)
    if(this.props.questions[questionIndex]) { //if the question index is valid
      this.setState({
        currentQuestionIndex: questionIndex,
      })

      this.props.goToQuestionCallback(questionIndex) //run the callback
      setTimeout(this.props.onScrollEndCallback, this.props.transitionSeconds*1000, questionIndex)
    }
  }


  render() {
    const {
      questions,
    } = this.props

    const topOffset = (window.innerHeight - QUESTION_HEIGHT) / 2

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
            top: QUESTION_HEIGHT * (i - this.state.currentQuestionIndex) + topOffset,
            left: 0,
            right: 0,
            opacity: i===this.state.currentQuestionIndex ? 1 : 0,
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
