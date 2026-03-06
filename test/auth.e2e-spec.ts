import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';



describe('Authentication system (e2e)', () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Handels a signup request ', async () => {
        const Email = 'asddfghgfdcghf2d@example.com';
        return await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                email: Email,
                password: '234rewsdcf'
            })

            .expect(201)
            .then((res) => {
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(Email)
            })
    });

    it('after signin returs the current user', async()=>{

        const Email='qwfg@example.com';

        const res = await request(app.getHttpServer()).post('/auth/signup')
        .send({
            email:Email,
            password:"2344"
        })
        .expect(201)

        const cookie:string[] = res.get('Set-Cookie') as string[];

        const {body} = await request(app.getHttpServer())
        .get('/auth/curUser')
        .set('Cookie',cookie)
        .expect(200)
        

        expect(body.email).toEqual(Email)
    })
});
