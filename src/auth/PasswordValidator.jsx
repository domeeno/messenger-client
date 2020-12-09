import Validator from 'password-validator';
// import React from 'react';
// import { propTypes } from 'react-bootstrap/esm/Image';

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
// const PasswordValidator = () => {
//   (
//     <div>
//       <ol>
//         <li>
//           Uppercase letter,
//           {' '}
//         </li>
//         <li>
//           Lowercase letter,
//           {' '}
//         </li>
//         <li>
//           Numbers (0-9),
//           {' '}
//         </li>
//         <li>
//           Special Characters,
//           {' '}
//         </li>
//         <li>
//           At least 12 characters
//         </li>
//       </ol>
//     </div>
//   );
//   return null;
// };

// PasswordValidator.propTypes = {
//   password: propTypes.string.isRequired,
// };

export default validatePassword;
