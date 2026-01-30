import validator from "validator";

const validationSignUpData = (req) => {
  const { firstname,  email, password } = req.body;

  if (!firstname ) {
    throw new Error("first  name is required ");
  } else if (!validator.isEmail(email)) {
    throw new Error("the email is not correct ! Please Enter a valid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "the password is not valid ! Please Enter a valid strong password",
    );
  }
};

export default validationSignUpData;
