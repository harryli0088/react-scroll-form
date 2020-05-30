import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'
import Question from "./Question/Question"


export default class ScrollForm extends Component {
  static propTypes = {
    enterToChangeQuestion: PropTypes.bool,
    goToQuestionCallback: PropTypes.func,
    onScrollEndCallback: PropTypes.func,
    passUpFunctions: PropTypes.func,
    questions: PropTypes.array.isRequired,
    tabToChangeQuestion: PropTypes.bool,
    touchScrollThreshold: PropTypes.number,
    transitionSeconds: PropTypes.number,
    wheelScrollThreshold: PropTypes.number,
  }

  static defaultProps = {
    enterToChangeQuestion: true,
    goToQuestionCallback: (questionIndex, validQuestionIndex) => {},
    onScrollEndCallback: questionIndex => {},
    passUpFunctions: ({goToQuestion, goToPrevQuestion, goToNextQuestion}) => {},
    tabToChangeQuestion: true,
    touchScrollThreshold: 10,
    transitionSeconds: 1,
    wheelScrollThreshold: 200,
  }

  state = {
    height: window.innerHeight,
    currentQuestionIndex: 0,
  }

  questionsContainerRef = React.createRef()

  componentDidMount() {
    this.onResize()
    window.addEventListener('resize', this.onResize)
    this.props.passUpFunctions({ //pass the functions to the parent
      goToQuestion: this.goToQuestion,
      goToPrevQuestion: this.goToPrevQuestion,
      goToNextQuestion: this.goToNextQuestion,
    })
    this.goToQuestion(0) //initialize to first question
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  onResize = e => {
    if(this.questionsContainerRef.current) {
      this.setState({
        height: this.questionsContainerRef.current.clientHeight
      })
    }
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
    const validQuestionIndex = this.props.questions[questionIndex] !== undefined
    if(validQuestionIndex) { //if the question index is valid
      this.setState({
        currentQuestionIndex: questionIndex,
      })

      setTimeout(this.props.onScrollEndCallback, this.props.transitionSeconds*1000, questionIndex)
    }

    this.props.goToQuestionCallback(questionIndex,validQuestionIndex) //run the callback
  }

  goToPrevQuestion = () => this.goToQuestion(this.state.currentQuestionIndex - 1)
  goToNextQuestion = () => this.goToQuestion(this.state.currentQuestionIndex + 1)


  render() {
    const {
      height,
    } = this.state

    const {
      questions,
      transitionSeconds,
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
        ref={this.questionsContainerRef}
      >
        {questions.map((q,i) =>
          <div key={i} style={{
            height: height,
            position: "absolute",
            top: height * (i - this.state.currentQuestionIndex),
            left: 0,
            right: 0,
            opacity: i===this.state.currentQuestionIndex ? 1 : 0,
            transition: transitionSeconds+"s",
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
