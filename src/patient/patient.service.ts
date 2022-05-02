import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IPatient } from 'src/pkg/entity/patient/patient.interface'
import { PatientRepository } from 'src/pkg/entity/patient/patient.repository'
import { UserEntity } from 'src/pkg/entity/user/user.entity'
import { CreatePatientDto } from './dto/create-patient.dto'
import { QueryPatientDto } from './dto/query-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientRepository)
    private patientRepository: PatientRepository,
  ) {}

  public async createOne(
    dto: CreatePatientDto,
    user: UserEntity,
  ): Promise<IPatient> {
    const patient = this.patientRepository.create()
    patient.firstName = dto.firstName
    patient.lastName = dto.lastName
    patient.dob = dto.dob
    patient.gender = dto.gender
    patient.height = dto.height
    patient.weight = dto.weight
    patient.bmi = dto.bmi
    patient.waistline = dto.waistline
    patient.fallHistory = dto.fallHistory
    patient.user = user

    const result = await this.patientRepository.save(patient)
    return result
  }

  public async updateById(
    id: string,
    dto: UpdatePatientDto,
  ): Promise<IPatient> {
    let patient = await this.patientRepository.findOneOrFail({ id })

    patient = { ...patient, ...dto }

    const result = await this.patientRepository.save(patient)

    return result
  }

  async getPagination(query: QueryPatientDto): Promise<IPatient[]> {
    const patients = await this.patientRepository.find({
      take: query.limit,
      skip: query.skip,
      relations: ['result'],
    })

    return patients
  }

  async getById(id: string): Promise<IPatient> {
    const patient = await this.patientRepository.findOneOrFail({ id })

    return patient
  }

  async deleteById(id: string): Promise<boolean> {
    const patient = await this.patientRepository.findOneOrFail({ id })

    await this.patientRepository.remove(patient)
    return true
  }
}
