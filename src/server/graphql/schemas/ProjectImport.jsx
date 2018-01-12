import {GraphQLString} from 'graphql'
import {GraphQLInputObjectType, GraphQLList} from 'graphql/type'

export default new GraphQLInputObjectType({
  name: 'ProjectImport',
  description: 'Project import values',
  fields: () => ({
    projectIdentifier: {type: GraphQLString, description: 'The project identifier'},
    descriptionURL: {type: GraphQLString, description: 'The project description URL'},
    memberIdentifiers: {type: new GraphQLList(GraphQLString), description: 'The identifiers of the project members'},
  }),
})
