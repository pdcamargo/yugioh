import { prisma } from "@repo/database";
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
} from "../decorators/decorators";

import type { Response } from "express";

@Controller()
export default class AppController {
  @Get()
  async index(
    @Res() res: Response,
    @Query("name") name: string | undefined,
    @Body() body: any,
  ) {
    const users = await prisma.user.findMany();

    return res.json({
      name,
      body,
    });
  }

  @Post()
  async indexPost(
    @Res() res: Response,
    @Query("name") name: string | undefined,
    @Body() body: any,
  ) {
    const users = await prisma.user.findMany();

    return res.json({
      name,
      body,
    });
  }
}
