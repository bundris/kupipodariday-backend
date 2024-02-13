import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(req.user.username, createOfferDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findMyOffers(@Req() req) {
    return this.offersService.findByUser(req.user.username);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findUserOffers(@Param('id', ParseIntPipe) id: number) {
    return this.offersService.findById(id);
  }
}
