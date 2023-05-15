import { UsersService } from "./users.service";
export declare class AuthService {
    private userService;
    constructor(userService: UsersService);
    signup(email: string, password: string): Promise<import("./user.entity").User>;
    login(email: string, password: string): Promise<import("./user.entity").User>;
}
