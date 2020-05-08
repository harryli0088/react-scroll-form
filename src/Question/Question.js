import React from 'react'
import PropTypes from 'prop-types'

import styles from "./question.css"

const Question = props => {
  return (
    <div className={styles.question}>
      <div>
        <div>
          {props.question.element}
        </div>

        {
          props.question.showCanMoveOnButton ?
          (
            <div style={{opacity: props.question.canMoveOn?1:0}}>
              <button onClick={props.nextQuestion}>Can move on</button>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

export default Question
