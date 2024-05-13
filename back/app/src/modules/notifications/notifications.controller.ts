import {Controller, Get, Post, Body, Patch, Param, Delete, Request, Query} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {ApiTags} from "@nestjs/swagger";
import {QueryNotificationsDto} from "./dto/query-notifications.dto";

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @Request() req: any,
    @Body() createNotificationDto: CreateNotificationDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      createNotificationDto.userId = sub
    }
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query() params: QueryNotificationsDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      params.userId = sub
    }
    return this.notificationsService.findAll(params);
  }

  @Get('unread/count')
  findUnreadCount(
    @Request() req: any,
    @Query() params: QueryNotificationsDto
  ) {
    const { sub } = req.user || {};
    if (sub) {
      params.userId = sub
    }
    return this.notificationsService.findUnreadCount(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
