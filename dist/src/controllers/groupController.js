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
import { groupSchema } from '../utils/validations/groupSchema.js';
const groupController = {
    getGroups: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userEmail = req.user.email;
        try {
            const userWithGroups = yield prisma.user.findUnique({
                where: {
                    email: userEmail,
                },
                select: {
                    groups: true,
                },
            });
            if (!userWithGroups) {
                return next({
                    status: 404,
                    message: 'User not found',
                });
            }
            const userGroups = userWithGroups.groups;
            return res.status(200).json(userGroups);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    getGroupByIdWithUsers: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userEmail = req.user.email;
        const groupId = parseInt(req.params.groupId);
        try {
            const group = yield prisma.group.findUnique({
                where: {
                    id: groupId,
                },
                include: {
                    users: true,
                },
            });
            if (!group) {
                return next({
                    status: 404,
                    message: 'Group not found',
                });
            }
            const userIsMember = group.users.find((user) => user.email === userEmail);
            if (!userIsMember) {
                return next({
                    status: 403,
                    message: 'Forbidden',
                });
            }
            return res.status(200).json(group);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    createGroup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const userEmail = req.user.email;
        const groupInput = req.body;
        const { success, data, error } = groupSchema.safeParse(groupInput);
        if (!success) {
            return next({
                status: 400,
                message: error.errors.map((err) => err.message).join(', '),
            });
        }
        try {
            const currentUser = yield prisma.user.findUnique({
                where: {
                    email: userEmail,
                },
            });
            if (!currentUser) {
                return next({
                    status: 404,
                    message: 'User not found',
                });
            }
            const newGroup = yield prisma.group.create({
                data: {
                    name: data.name,
                    colorId: data.colorId,
                    users: {
                        connect: {
                            email: userEmail,
                        },
                    },
                    ownerId: currentUser === null || currentUser === void 0 ? void 0 : currentUser.id,
                },
            });
            return res.status(201).json(newGroup);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    updateGroup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const groupId = parseInt(req.params.groupId);
        const groupInput = req.body;
        const { success, data, error } = groupSchema
            .partial()
            .safeParse(groupInput);
        if (!success) {
            return next({
                status: 400,
                message: error.errors.map((err) => err.message).join(', '),
            });
        }
        try {
            const currentUser = yield prisma.user.findUnique({
                where: {
                    email: req.user.email,
                },
            });
            const group = yield prisma.group.findUnique({
                where: {
                    id: groupId,
                },
            });
            if (!group || !currentUser) {
                return next({
                    status: 404,
                    message: 'User or Group not found',
                });
            }
            if (group.ownerId !== currentUser.id) {
                return next({
                    status: 403,
                    message: 'Forbidden',
                });
            }
            const updatedGroup = yield prisma.group.update({
                where: {
                    id: groupId,
                },
                data,
            });
            return res.status(200).json(updatedGroup);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
    removeUserFromGroup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user) {
            return next({
                status: 401,
                message: 'Unauthorized',
            });
        }
        const groupId = parseInt(req.params.groupId);
        const userIdToRemove = parseInt(req.params.userId);
        try {
            const currentUser = yield prisma.user.findUnique({
                where: {
                    email: req.user.email,
                },
            });
            const group = yield prisma.group.findUnique({
                where: {
                    id: groupId,
                },
            });
            const userToRemove = yield prisma.user.findUnique({
                where: {
                    id: userIdToRemove,
                },
            });
            if (!group || !currentUser || !userToRemove) {
                return next({
                    status: 404,
                    message: 'User or Group not found',
                });
            }
            if (group.ownerId !== currentUser.id) {
                return next({
                    status: 403,
                    message: 'Forbidden',
                });
            }
            const updatedGroup = yield prisma.group.update({
                where: {
                    id: groupId,
                },
                data: {
                    users: {
                        disconnect: {
                            id: userToRemove.id,
                        },
                    },
                },
            });
            return res.status(200).json(updatedGroup);
        }
        catch (error) {
            return next({
                message: error.message,
            });
        }
    }),
};
export default groupController;
