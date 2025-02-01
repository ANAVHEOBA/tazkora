import { Partner, IPartner } from './partner.model';
import { CreatePartnerInput } from './partner.schema';

export class PartnerCrud {
    async create(data: CreatePartnerInput): Promise<IPartner> {
        const partner = new Partner(data);
        return partner.save();
    }

    async findByName(name: string): Promise<IPartner | null> {
        return Partner.findOne({ name });
    }


    async findById(id: string): Promise<IPartner | null> {
        return Partner.findById(id);
    }

    async update(id: string, data: Partial<CreatePartnerInput>): Promise<IPartner | null> {
        return Partner.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );
    }

    async delete(id: string): Promise<IPartner | null> {
        return Partner.findByIdAndDelete(id);
    }
}