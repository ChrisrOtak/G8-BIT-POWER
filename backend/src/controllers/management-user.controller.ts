import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Management,
  User,
} from '../models';
import {ManagementRepository} from '../repositories';

export class ManagementUserController {
  constructor(
    @repository(ManagementRepository) protected managementRepository: ManagementRepository,
  ) { }

  @get('/managements/{id}/user', {
    responses: {
      '200': {
        description: 'Management has one User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User> {
    return this.managementRepository.admin(id).get(filter);
  }

  @post('/managements/{id}/user', {
    responses: {
      '200': {
        description: 'Management model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Management.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUserInManagement',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.managementRepository.admin(id).create(user);
  }

  @patch('/managements/{id}/user', {
    responses: {
      '200': {
        description: 'Management.User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: Partial<User>,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.managementRepository.admin(id).patch(user, where);
  }

  @del('/managements/{id}/user', {
    responses: {
      '200': {
        description: 'Management.User DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.managementRepository.admin(id).delete(where);
  }
}
