var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// [ Local imports ]
import prisma from '../models/client.js';
import canAccessToGroup from '../utils/canAccessToGroup.js';
import { contactSchema } from '../utils/validations/contactSchema.js';
const contactController = {
    getContacts: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userEmail = req.user.email;
        const groupId = parseInt(req.params.groupId);
        try {
            // Check if user can access the group
            const canAccess = yield canAccessToGroup(groupId, userEmail);
            if (!canAccess) {
                return next({
                    status: 403,
                    message: 'Forbidden',
                });
            }
            const contacts = yield prisma.contact.findMany({
                where: {
                    groupId,
                },
            });
            return res.status(200).json(contacts);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    createContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userEmail = req.user.email;
        const groupId = parseInt(req.params.groupId);
        // Zod schema validation with partial() to allow missing groupId
        const { success, data, error } = contactSchema
            .partial({ groupId: true })
            .safeParse(req.body);
        if (!success) {
            return next({
                status: 400,
                message: error.errors.map((err) => err.message).join(', '),
            });
        }
        //Check if groupId in params is the same as groupId in body, if provided (wich is stored in svelte store as Contact object)
        if (data.groupId && data.groupId !== groupId) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        try {
            // Check if user can access the group
            const canAccess = yield canAccessToGroup(groupId, userEmail);
            if (!canAccess) {
                return next({
                    status: 403,
                    message: 'Forbidden',
                });
            }
            const newContact = yield prisma.contact.create({
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    type: data.type,
                    content: data.content,
                    color: {
                        connect: {
                            id: data.colorId,
                        },
                    },
                    group: {
                        connect: {
                            id: groupId,
                        },
                    },
                },
            });
            return res.status(201).json(newContact);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    updateContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userEmail = req.user.email;
        const groupId = parseInt(req.params.groupId);
        const contactId = parseInt(req.params.contactId);
        const { success, data, error } = contactSchema
            .partial()
            .safeParse(req.body);
        if (!success) {
            return next({
                status: 400,
                message: error.errors.map((err) => err.message).join(', '),
            });
        }
        //Check if groupId in params is the same as groupId in body, if provided (wich is stored in svelte store as Contact object)
        if (data.groupId && data.groupId !== groupId) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        try {
            // Check if user can access the group
            const canAccess = yield canAccessToGroup(groupId, userEmail);
            if (!canAccess) {
                return next({
                    status: 403,
                    message: 'Forbidden',
                });
            }
            const isContactExist = yield prisma.contact.findFirst({
                where: {
                    id: contactId,
                },
            });
            if (!isContactExist) {
                return next({
                    status: 404,
                    message: 'Not found',
                });
            }
            const updatedContact = yield prisma.contact.update({
                where: {
                    id: contactId,
                },
                data,
            });
            return res.status(200).json(updatedContact);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
};
export default contactController;
