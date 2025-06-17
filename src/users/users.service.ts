import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto'; // Import CreateUserDto
import { User, UserDocument, UserRole } from './schemas/user.schema'; // Import User and UserDocument

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Change return type to UserDocument
    const createdUser = new this.userModel({
      email: createUserDto.email,
      password: createUserDto.password, // Password hashing happens in schema pre-save hook
      roles: [UserRole.DONOR], // Default role
    });
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    // Change return type to UserDocument | null
    return this.userModel.findOne({ email }).exec();
  }

  async findOneById(id: string): Promise<UserDocument | null> {
    // Change return type to UserDocument | null
    return this.userModel.findById(id).exec();
  }

  async findByRole(role: UserRole): Promise<UserDocument[]> {
    return this.userModel.find({ roles: role }).exec();
  }

  async findByRoles(roles: UserRole[]): Promise<UserDocument[]> {
    return this.userModel.find({ roles: { $in: roles } }).exec();
  }

  // Add other user-related methods here (e.g., update, delete, find by role)
}
