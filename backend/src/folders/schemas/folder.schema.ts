import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FolderDocument = Folder & Document;

@Schema({ timestamps: true })
export class Folder {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Number })
  publishingYear?: number;

  @Prop({ trim: true })
  image?: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Prop({ type: Date })
  moveDate?: Date;

  @Prop({ type: Object })
  address?: {
    from: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    to: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  estimatedCost: number;

  @Prop({ default: 0 })
  actualCost: number;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
