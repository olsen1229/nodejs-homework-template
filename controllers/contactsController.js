import { Contact } from "../models/contactsModel.js";
import { contactValidation, favoriteValidation } from "../validation/validation.js";


const getAllContacts = async (_req, res, next) => {
try {
    // const result = await listContacts();
    const result = await Contact.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
try {
    const { contactId } = req.params;
    const result = Contact.findOne(contactId);
    
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error); // default middleware handler ni express
  }
};

const addContact = async (req, res, next) => {

// eslint-disable-next-line no-undef
const { error } = contactValidation.validate(req.body);

if (error) {
    res.status(400).json({ message: "missing required name field" });
    }
    
try {
const result = await Contact.create(req.body);
    // const result = await addContact(req.body);
    res.status(201).json(result);
} catch (error) {
    next(error);
}
};

const deleteContact = async (req, res, next) => {
try {
    const { contactId } = req.params;
    // const result = await removeContact(contactId);
    const result = await Contact.findByIdAndDelete(contactId);
    // const result = await Contact.findOneAndRemove(contactId);

    if (!result) {
      res.status(404).json({ message: "Not found" });
        }
       res.status(200).json(result);
  } catch (error) {
    next(error); 
  }

  // return result;
};

const updateContact = async (req, res, next) => {
// eslint-disable-next-line no-undef
const { error } = contactValidation.validate(req.body);

  if (error) {
    res.status(400).json({ message: "missing required name field" });
  }

  try {
    // const result = await updateContact(req.params.contactId, req.body);
    const result = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body
    );

    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res) => {
  // Validate the favorite field
  const { error } = favoriteValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const { contactId } = req.params;

    const result = await contactId.findByIdAndUpdate(contactId, req.body, {
      favorite: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(result);
    
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ message: error.message });
  }
};


export {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
  updateStatusContact
};