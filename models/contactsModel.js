// Why do we need Schema?
// THERE IS NO STRICT UNIFORM FORMAT THAT IS FOLLOWED FOR DATA BEING SAVED IN MONGODB

// SCHEMA
// enforces uniformity across the data or document fields being saved in the mongodb collection
// this does not mean that all of the fields we declare in the schema is mandatory
// there is an option for us to assign a mandatory or required field
// and its also possible for us to make a field optional
// the important thing is that all the fields that can be added in the document object must adhere to the fields declared in the document schema

// eslint-disable-next-line import/no-duplicates
import mongoose from "mongoose";
// eslint-disable-next-line import/no-duplicates
import { Schema } from "mongoose";

// schema is the rule for uniformity
// MONGOOSE SCHEMA VALIDATION
// validates the data before saving it to the Mongodb database
// this happens after the network request is sent

const contactSchema = new Schema({
  // the name of the fields inside a schema must be unique
  name: {
    type: String,
    required: [true, "Set name for contact"],
    index: 1,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

// model is the object that implements or uses the schema

// it is best practice to use a variable name starting with a capital letter to name a model
const Contact = mongoose.model("contact", contactSchema);

export { Contact };

// MVC Architecture
// Model View Controller Architecture
// Model refers to the schema that we are applying the our object models
// View refers to the data presentation for the response from the route
// Controller refers to the function managing the responses of our routes