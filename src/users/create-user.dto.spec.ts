import { validate } from "class-validator";
import { CreaeteUserDto } from "./create-user.dto";

describe('CreateUserDto', () => {
    let dto = new CreaeteUserDto();

    beforeEach(() => {
        dto = new CreaeteUserDto();
        dto.email = 'test@test.com';
        dto.name = 'Piotr';
        dto.password = '123456A#';
    })

    it('should validate complete valid data', async () => {
        // 3xA
        // Arrange
        // Act
        const errors = await validate(dto);
        //Assert
        expect(errors.length).toBe(0);
    });


    it('should fail on invalid email', async () => {
        // Arrange
        dto.email = 'test';
        // Act
        const errors = await validate(dto);
        // Assert
        // console.log(errors);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('email')
        expect(errors[0].constraints).toHaveProperty('isEmail');
    });


    const testPassword = async (password: string, message: string) => {
        dto.password = password;
        const errors = await validate(dto);
        const passwordError = errors.find((error) => error.property === 'password')
        expect(passwordError).not.toBeUndefined();
        const messages = Object.values(passwordError?.constraints ?? {});
        expect(message).toContain(message)

    }

    // 1) At lease 1 uppercase letter
    // 2) At least 1 number
    // 3) At least 1 special character

    // 1) At lease 1 uppercase letter
    it('should fail without 1 uppercase letter', async () => {
        await testPassword(
            'abcdef',
            'Password must contain at least 1 uppercase letter'
        );
    });

    // 2) At least 1 number
    it('should fail without at least 1 number', async () => {
        await testPassword(
            'abcdefaA',
            'Password must contain at least 1 number');
    });

    // 3) At least 1 special character
    it('should fail without at least 1 special character', async () => {
        await testPassword(
            'abcdefaA1',
            'Password must contain at least 1 special character');
    });

});