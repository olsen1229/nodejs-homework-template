import express from 'express';
import { listContacts, getContactById, addContact, removeContact, updateContact } from '../../models/contacts';

const router = express.Router()


// READ
router.get('/', async (req, res, next) => {
  try {
    const result = await listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
 
});

// READ
router.get('/:contactId', async (req, res, next) => {

  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
      res.status(404).json({ message: "Not found" });

      // create an error
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }

    return result;
  } catch (error) {
    next(error);
  }
});

//CREATE
router.post('/', async (req, res, next) => {

  const { name, email, phone } = req.body;

  //const result = await addContact({ name, email, phone });

  try {
    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }

});

router.delete('/:contactId', async (req, res, next) => {

  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (!result) {
      res.status(404).json({ message: "Not found" });

      // create an error
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
  return result;
});

router.put('/:contactId', async (req, res, next) => {
  
  try {
    const result = await updateContact(req.params.contactId, req.body);

    if (!result) {
      res.status(404).json({ messge: "Not found" });

      // create an error
      const error = new Error("Not found");
      error.status = 404;
      throw error;
    }  


    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export { router };
