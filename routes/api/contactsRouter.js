import express from "express";
import {
  getAllContacts,
  getContactById,
  addContact,
  deleteContact,
  updateContact,
} from "../../controllers/contactsController.js";


const router = express.Router()

// corresponds to listContacts
router.get("/", getAllContacts);

// corresponds to getContactById
router.get("/:contactId", getContactById);

// corresponds to addContact
router.post("/", addContact);

// corresponds to removeContact
router.delete("/:contactId", deleteContact);

// corresponds to updateContact
router.put("/:contactId", updateContact);

export { router };