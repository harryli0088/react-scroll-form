import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'
import Question from "./Question/Question"

export default class ScrollForm extends Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,

    goToQuestionCallback: PropTypes.func,
    onScrollEndCallback: PropTypes.func,
  }

  static defaultProps = {
    goToQuestionCallback: questionIndex => console.log("questionIndex",questionIndex),
    onScrollEndCallback: questionIndex => console.log("questionIndex",questionIndex),
  }

  state = {
    currentQuestionIndex: 0,
  }

  currentQuestionIndex = 0
  scrollTimeout = null

  componentDidMount() {
    this.goToQuestion(0)
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
    console.log("scroll ended")
    this.props.onScrollEndCallback(this.currentQuestionIndex)
  }

  onKeyDown = e => {
    console.log(e)
    if(e.key==="Tab" && e.shiftKey) {
      e.preventDefault()
      this.goToQuestion(this.currentQuestionIndex - 1)
    }
    else if(e.key==="Tab" || e.key==="Enter") {
      e.preventDefault()
      this.goToQuestion(this.currentQuestionIndex + 1)
    }
  }

  goToQuestion = (questionIndex) => {
    if(questionIndex>=0 && questionIndex<this.props.questions.length) {
      this[`div${questionIndex}`].scrollIntoView({
        behavior: "smooth"
      })
      this.currentQuestionIndex = questionIndex

      this.props.goToQuestionCallback(questionIndex)
    }
  }

  render() {
    const {
      questions,
    } = this.props

    return (
      <div className={styles.questionsContainer}>
        {questions.map((q,i) =>
          <div key={i} ref={div => this[`div${i}`] = div}>
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
