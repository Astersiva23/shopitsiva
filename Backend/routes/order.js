import express from 'express';
const router = express.Router();
import {authorizeRoles, isAuthentictedUser} from '../middlewares/authh.js'
import { allOrders, getOrderDetails, myOrders, newOrder, updateOrder } from '../controllers/orderControllers.js';

router.route('/orders/new').post(isAuthentictedUser,newOrder);
router.route('/orders/:id').get(isAuthentictedUser,getOrderDetails);
router.route('/me/orders').get(isAuthentictedUser,myOrders);
router.route('/admin/orders').get(isAuthentictedUser,authorizeRoles("admin"),allOrders);
router.route('/admin/orders/:id').put(isAuthentictedUser,authorizeRoles("admin"),updateOrder);

export default router