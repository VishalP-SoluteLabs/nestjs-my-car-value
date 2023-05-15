import { Body, Controller, Get, Post, Delete, Patch, Param, Query, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
    ) {}

    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any){        
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColors(@Session() session: any){
    //     return session.color;
    // }
    
    // @Get('/whoami')
    // getWhoAmI(@Session() session: any){
    //     return this.userService.findOne(session.userId);
    // }    

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User ){
        return user;
    }


    
    @Post('/signup') 
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user;
    }

    @Post('/login')
    async login(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.login(body.email, body.password);
        session.userId = user.id
        return user;
    }

    @Post('/logout')
    async logout(@Session() session: any){
        session.userId = null
    }


    // @UseInterceptors(new SerializeInterceptor(UserDto))   //it helps to use (@Exclude() that we used in entity) - so that we can exclude password while showing it in response(in frontend)
    @Get('/:id')
    async finsUser(@Param('id') id: string){                 //Here from url id is in form of string
        console.log('Handler is running')
        const user = await this.userService.findOne(parseInt(id));  //so to pass as an int we have to parse them as parseInt(id)
        if(!user){
            throw new NotFoundException('User not found!!')
        }

        return user;
    }

    @Get('/')
    findAllUsers(@Query('email') email: string){
         return this.userService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }
}
