import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';



describe('AuthService', () => {
    let service: AuthService;
    let fakeUserService: Partial<UsersService>
    beforeEach(async () => {
        // create a fake copy of user service
        const users: User[] = [];
        fakeUserService = {
            find: (email: string) => {
                const filteredUser = users.filter(user => user.email === email)
                return Promise.resolve(filteredUser);
            },
            create: (email: string, password: string) => {
                const user = ({ id: Math.floor(Math.random() * 9999999), email, password } as User);
                users.push(user);
                return Promise.resolve(user)
            }
        };

        const module = await Test.createTestingModule({
            providers: [AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService,
                }
            ]
        }).compile()

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    })

    it(' Creates a new user with a salted and hashed password ', async () => {
        const user = await service.signup('asd@as.com', 'asdf')

        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split(".");
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('Throws an error if user signs up with email that is in use', async () => {
        // fakeUserService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        // await expect(service.signup('asdf@as', 'as')).rejects.toThrow(
        //     BadRequestException,
        // );
        await service.signup('asdf@asdf', 'asdf');
        await expect(service.signup('asdf@asdf', 'asdf')).rejects.toThrow(BadRequestException)
    });

    it('Throws if signin is called with an unused email', async () => {
        await expect(service.signin('asdfdfgfs@wefde.com', 'wedxswerg'))
            .rejects.toThrow(NotFoundException);
    });

    it('throws if invalid password is provided', async () => {
        // fakeUserService.find = () => Promise.resolve([
        //     { email: 'asdf@asdf', password: 'efvbtreds' } as User,
        // ]);
        // await expect(
        //     service.signin('asdfasdfdas', 'password'),
        // ).rejects.toThrow(BadRequestException);

        await service.signup('asdf@asdf', 'asdf');
        await expect(service.signin('asdf@asdf', 'asd2')).rejects.toThrow(BadRequestException)
    });

    it('returns a user if a correct password is provided', async () => {
        await service.signup('asdf@sdf', 'asdfgh')
        const user = service.signin('asdf@sdf', 'asdfgh')
        expect(user).toBeDefined()
    })
})

