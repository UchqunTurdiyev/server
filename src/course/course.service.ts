import { Injectable } from '@nestjs/common';
import { CourseBodyDto } from './course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './course.model';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async createCourse(dto: CourseBodyDto, id: string) {
    return await this.courseModel.create({ ...dto, author: id });
  }

  async editCourse(dto: CourseBodyDto, courseId: string) {
    return await this.courseModel.findByIdAndUpdate(courseId, dto, { new: true });
  }
}
