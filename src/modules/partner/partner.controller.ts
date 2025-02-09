import { Request, Response } from 'express';
import { PartnerCrud } from './partner.crud';
import { CreatePartnerSchema } from './partner.schema';
import { NotificationCrud } from '../notifications/notification.crud';
import mongoose from 'mongoose';

export class PartnerController {
    private partnerCrud: PartnerCrud;
    private notificationCrud: NotificationCrud;

    constructor() {
        this.partnerCrud = new PartnerCrud();
        this.notificationCrud = new NotificationCrud();
    }

    async create(req: Request, res: Response): Promise<Response> {
        try {
            // Validate input
            const validatedInput = CreatePartnerSchema.parse(req.body);

            // Check if partner already exists
            const existingPartner = await this.partnerCrud.findByName(validatedInput.name);
            if (existingPartner) {
                return res.status(400).json({
                    success: false,
                    message: 'Partner already exists'
                });
            }

            // Create partner
            const partner = await this.partnerCrud.create(validatedInput);

            // Create notification for all users
            await this.notificationCrud.createForAllUsers({
                type: 'NEW_PARTNER',
                title: 'New Partner Added',
                message: `${partner.name} has joined as a new partner! Check out their tasks.`,
                partnerId: partner._id as mongoose.Types.ObjectId,
                isRead: false
            });

            return res.status(201).json({
                success: true,
                message: 'Partner created successfully',
                partner
            });
        } catch (error) {
            console.error('Create Partner Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }


    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid partner ID'
                });
            }

            const partner = await this.partnerCrud.findById(id);
            if (!partner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found'
                });
            }

            return res.status(200).json({
                success: true,
                partner
            });
        } catch (error) {
            console.error('Get Partner Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid partner ID'
                });
            }

            const validatedInput = CreatePartnerSchema.partial().parse(req.body);

            const updatedPartner = await this.partnerCrud.update(id, validatedInput);
            if (!updatedPartner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Partner updated successfully',
                partner: updatedPartner
            });
        } catch (error) {
            console.error('Update Partner Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid partner ID'
                });
            }

            const deletedPartner = await this.partnerCrud.delete(id);
            if (!deletedPartner) {
                return res.status(404).json({
                    success: false,
                    message: 'Partner not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Partner deleted successfully'
            });
        } catch (error) {
            console.error('Delete Partner Error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

}