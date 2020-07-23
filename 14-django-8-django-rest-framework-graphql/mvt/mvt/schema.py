from graphene import ObjectType, Schema
from polls.schema import Query

class Query(Query, ObjectType):
    pass

schema = Schema(query=Query)