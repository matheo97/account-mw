import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import {
  GetAllUsersControllerDto,
  GetUserControllerDto,
  UpdateUserControllerDto,
} from './dto';
import { catchError } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @MessagePattern('account.user.update')
  async updateUser(
    @Body() { userId, currentUser, userToUpdate }: UpdateUserControllerDto,
  ) {
    return this.client
      .send('users.update', {
        currentUser,
        userToUpdate,
        userId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.user.get')
  async getUser(@Body() { userId, currentUser }: GetUserControllerDto) {
    return this.client
      .send('users.findOneById', {
        id: userId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.user.getAll')
  async getAllUsers(
    @Body()
    { companyId, page, pageSize, currentUser }: GetAllUsersControllerDto,
  ) {
    return this.client
      .send('users.findAllByCompanyId', {
        companyId,
        page,
        pageSize,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
