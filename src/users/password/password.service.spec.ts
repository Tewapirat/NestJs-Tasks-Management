import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //hash()
  // plain text -> hash
  // for the same input -> the same output
  // 12345678 -> asdafwefasdn98ohasnd
  //--------------
  // bcrypt.hash -> was called
  //             -> password was passed to it & salt rounds
  // mocks & spies

  it('should has password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password123';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenLastCalledWith(password, 10);

    expect(result).toBe(mockHash)
  })

  // 1)  const mockHash = 'hashed_password'; ถ้า hash สำเร็จจะได้ค่า "hashed_password" คืนกลับมา
  // 2)  (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash); เมื่อเรียก bcrypt.hash(...) ให้ promise ออกมาเป็น "hashed_password"
  // 3)  const password = 'password123'; password ที่จะใช้ทดสอบ
  // 4)  const result = await service.hash(password); เรียก Method ที่ต้องการทดสอบ "service.hash(password)" -> ไปเรียก bcrypt.hash(password,10)
  // 5)  expect(bcrypt.hash).toHaveBeenLastCalledWith(password,10); เช็คว่า bcrypt.hash ถูกเรียกถูกต้องไหม 
  // 6)  expect(result).toBe(mockHash) เช็คผลลัพธ์ที่ return กลับมา


  it('should correctly verify password', async () => {
    // 1) mock bcrypt.compare()
    // 2) mock the resolved value
    // 3) call the service method
    // 4) bcrypt.compare - was call with specific arguments
    // 5) We verify if the service method returned what bcrypt compare() did

    (bcrypt.compare as jest.Mock).mockResolvedValue(true)
    const result = await service.verify('password123', 'hashed_password');
    expect(bcrypt.compare).toHaveBeenLastCalledWith('password123', 'hashed_password')
    expect(result).toBe(true)
  });

  it('should fail on incorret password', async () => {
    // 1) mock bcrypt.compare() - fails!
    // 2) mock the resolved value
    // 3) call the service method
    // 4) bcrypt.compare - was call with specific arguments
    // 5) We verify if the service method returned what bcrypt compare() did

    (bcrypt.compare as jest.Mock).mockResolvedValue(false)
    const result = await service.verify('wrong_password', 'hashed_password');
    expect(bcrypt.compare).toHaveBeenLastCalledWith('wrong_password', 'hashed_password')
    expect(result).toBe(false)


  });


});
