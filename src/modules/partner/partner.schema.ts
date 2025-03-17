import { z } from 'zod';

export const CreatePartnerSchema = z.object({
    name: z.string().min(2).max(50),
    logo: z.string().url(),
    description: z.string().min(10).max(500),
    taskType: z.string().min(2).max(50),
    pointValue: z.number().positive(),
    targetCount: z.number().positive(),
    status: z.enum(['active', 'inactive']).default('active'),
    taskLink: z.string().url('Task link must be a valid URL'),
});

export type CreatePartnerInput = z.infer<typeof CreatePartnerSchema>;