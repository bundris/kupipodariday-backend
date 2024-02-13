import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.username, createWishDto);
  }

  @UseGuards(JwtGuard)
  @Get('last')
  findLastWishes() {
    return this.wishesService.findMany({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  @UseGuards(JwtGuard)
  @Get('top')
  findTopWishes() {
    return this.wishesService.findMany({
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wishesService.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: { user: true },
      },
    });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne({ where: { id } }, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.wishesService.removeOne(req.user.id, { where: { id } });
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.wishesService.copyWish(req.user.username, id);
  }
}
