import Validator from 'password-validator';
import Popover from 'react-bootstrap/Popover';
import React from 'react';

const schema = new Validator();
schema.is().min(12).is().max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

const validatePassword = (password) => {
  (
    schema.validate(password)
  );
  return schema.validate(password);
};

export const popover = (
  <Popover>
    <Popover.Title as="h3" className="text-center">
      Password Criteria
      {' '}
    </Popover.Title>
    <Popover.Content>
      <p className="my-0">12 characters and must include:</p>
      <p className="my-0">
        <i className="fas fa-caret-right mr-1" />
        {' '}
        UPPER case letters
      </p>
      <p className="my-0">
        <i className="fas fa-caret-right mr-1" />
        {' '}
        lower case letters
      </p>
      <p className="my-0">
        <i className="fas fa-caret-right mr-1" />
        {' '}
        at least one number
      </p>
      <p className="my-0">
        <i className="fas fa-caret-right mr-1" />
        {' '}
        at least one symbol
      </p>
    </Popover.Content>
  </Popover>
);

export default validatePassword;
