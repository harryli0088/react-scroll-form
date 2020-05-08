import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'
import Question from "./Question/Question"

export default class ScrollForm extends Component {
  static propTypes = {
    questions: PropTypes.array.isRequired,
  }

  state = {
    currentQuestionIndex: -1,
  }

  componentDidMount() {
    this.nextQuestion()
  }

  nextQuestion = () => {
    if(this.state.currentQuestionIndex < this.props.questions.length-1) {
      this[`div${this.state.currentQuestionIndex+1}`].scrollIntoView({
        behavior: "smooth"
      })
      this.setState({currentQuestionIndex: this.state.currentQuestionIndex + 1})

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
              nextQuestion={this.nextQuestion}
              question={q}
            />
          </div>
        )}
      </div>
    )
  }
}
