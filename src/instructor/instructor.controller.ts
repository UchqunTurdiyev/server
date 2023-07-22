import { Controller, HttpCode, Post, Body } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { InstructorApplyDto } from './dto/instructor.dto';

@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @HttpCode(200)
  @Post('apply')
  async applyAsInstructor(@Body() dto: InstructorApplyDto) {
    return this.instructorService.applyAsInstructor(dto);
  }
}
