import Joi from "joi";

// Joi is an object schema validation library that works similarly with Mongoose Schema
// To create a validator function, we can make use of the object() method and pass an object that contains the required parameters that we want to set in our request body

// JOI VALIDATION
// validates the data before sending it as the request body to a server route or endpoint
// this happens before the network request is sent


const contactValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const favoriteValidation = Joi.object({
  favorite: Joi.bool().required(),
});

export { contactValidation, favoriteValidation };