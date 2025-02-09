import { z } from 'zod';
import mongoose from 'mongoose';

// For internal use (DB operations)
export interface INotificationInput {
    type: 'NEW_PARTNER' | 'PARTNER_UPDATE' | 'PARTNER_DELETE';
    title: string;
    message: string;
    partnerId: mongoose.Types.ObjectId;
    isRead: boolean;
}

// For API validation
export const NotificationSchema = z.object({
    userId: z.string(),
    type: z.enum(['NEW_PARTNER', 'PARTNER_UPDATE', 'PARTNER_DELETE']),
    title: z.string(),
    message: z.string(),
    partnerId: z.string(),
    isRead: z.boolean().default(false)
});

export type CreateNotificationInput = z.infer<typeof NotificationSchema>;
