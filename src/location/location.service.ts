import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location, LocationDocument } from './schemas/location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async create(
    createLocationDto: CreateLocationDto,
  ): Promise<LocationDocument> {
    const createdLocation = new this.locationModel(createLocationDto);
    return createdLocation.save();
  }

  async findAll(): Promise<LocationDocument[]> {
    return this.locationModel.find().exec();
  }

  async findOne(id: string): Promise<LocationDocument | null> {
    return this.locationModel.findById(id).exec();
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<LocationDocument | null> {
    return this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<LocationDocument | null> {
    return this.locationModel.findByIdAndDelete(id).exec();
  }

  // Add methods for finding by district, etc.
}
