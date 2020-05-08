import React from 'react'
import PropTypes from 'prop-types'

import styles from "./question.css"

const Question = props => {
  return (
    <div className={styles.question}>
      <div>
        {props.question.element}
      </div>
    </div>
  )
}

export default Question
