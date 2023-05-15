import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService){}

    async intercept(context: ExecutionContext, handler: CallHandler){
        const request = await context.switchToHttp().getRequest();
        
        const { userId } = request.session || {};

        if(userId){
            const user = await this.userService.findOne(userId);
            request.currentUser = user;
        }


        return handler.handle()  //means go ahead and handle the actual route handler now
    }
}