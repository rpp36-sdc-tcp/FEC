import React from 'react';
import questions from '../sampledata/sampleQuestions.js';
import QuestionsListEntry from './QuestionsListEntry.jsx';
const QuestionsAnswersList = (props) => {
  return (
    <div>
      {props.questions.map((question) => {
        return (
          <QuestionsListEntry
            question={question.question_body}
            askedBy={question.asker_name}
            askedDate={question.question_date}
            key={question.question_id}
          />
        );
      })}
      {/* {
      sampleQuestionsAnswers.product_id === props.productId
      ?
      sampleQuestionsAnswers.results
      :
      "nothing"
      } */}
    </div>
  );
};

export default QuestionsAnswersList;
