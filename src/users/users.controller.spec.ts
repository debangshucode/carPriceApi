import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';



describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {

    const users: User[] = []
    fakeUserService = {
      findOne: (id: number) => {
        // const user = users.find(user => user.id === id) as User;
        // return Promise.resolve(user)
        return Promise.resolve({ id, email: 'asdf@asd', password: 'asd' } as User);
      },
      find: (email: string) => {
        // const user = users.filter(user => user.email === email)
        // return Promise.resolve(user)
        return Promise.resolve([{ id: 1, email, password: 'asd' } as User])
      },
    }
    //   remove: () => {

    //   },
    //   update: () => {

    //   }
    // };

    fakeAuthService = {
      // signup: (email:string,password:string) => {
      //   return Promise.resolve({id:1,email,password} as User)
      // },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    };


    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users returens the list of user with given mail', async () => {
    const users = await controller.findAllUsers('asdf@asd')
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asd')
  });

  it('findUser returns a single user with a given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  })

  // it('findUser throws an error if user with given id is not found', async () => {
  //   fakeUserService.findOne = () => null;
  //   await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);  
  // }); user not found is not implemented in controller but it is implemented in userServices

  it('sign in updates session obj and return user ', async () => {
    const session = { userId: -10 }
    const user = await controller.signin({ email: 'asd@asd', password: 'asdf' },
      session
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1)
  })

});
