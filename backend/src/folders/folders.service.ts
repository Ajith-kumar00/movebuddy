import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
  ) { }

  async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    try {
      const createdFolder = new this.folderModel(createFolderDto);
      return await createdFolder.save();
    } catch (error) {
      throw new BadRequestException('Failed to create folder: ' + error.message);
    }
  }

  async getmovielist(userId?: string, page: number = 1, limit: number = 10): Promise<{
    folders: Folder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const query: any = {};
      console.log(userId, query);
      if (userId) {
        query.userId = userId;
      }

      const skip = (page - 1) * limit;

      const [folders, total] = await Promise.all([
        this.folderModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.folderModel.countDocuments(query).exec(),
      ]);

      return {
        folders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch movie list: ' + error.message);
    }
  }

  async findAll(userId?: string, status?: string, page: number = 1, limit: number = 10): Promise<{
    folders: Folder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const query: any = {};

      if (userId) {
        query.userId = userId;
      }

      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [folders, total] = await Promise.all([
        this.folderModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.folderModel.countDocuments(query).exec(),
      ]);

      return {
        folders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch folders: ' + error.message);
    }
  }

  async findOne(id: string): Promise<Folder> {
    try {
      const folder = await this.folderModel.findById(id).exec();
      if (!folder) {
        throw new NotFoundException(`Folder with ID ${id} not found`);
      }
      return folder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch folder: ' + error.message);
    }
  }

  async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{
    folders: Folder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [folders, total] = await Promise.all([
        this.folderModel
          .find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.folderModel.countDocuments({ userId }).exec(),
      ]);

      return {
        folders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch user folders: ' + error.message);
    }
  }

  async update(id: string, updateFolderDto: UpdateFolderDto): Promise<Folder> {
    try {
      const updatedFolder = await this.folderModel
        .findByIdAndUpdate(id, updateFolderDto, { new: true, runValidators: true })
        .exec();

      if (!updatedFolder) {
        throw new NotFoundException(`Folder with ID ${id} not found`);
      }

      return updatedFolder;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update folder: ' + error.message);
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const result = await this.folderModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException(`Folder with ID ${id} not found`);
      }

      return { message: 'Folder deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete folder: ' + error.message);
    }
  }





  async getStats(userId?: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    totalEstimatedCost: number;
    totalActualCost: number;
  }> {
    try {
      const query = userId ? { userId } : {};

      const stats = await this.folderModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
            },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            totalEstimatedCost: { $sum: '$estimatedCost' },
            totalActualCost: { $sum: '$actualCost' },
          }
        }
      ]);

      return stats[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        totalEstimatedCost: 0,
        totalActualCost: 0,
      };
    } catch (error) {
      throw new BadRequestException('Failed to get folder stats: ' + error.message);
    }
  }

}
