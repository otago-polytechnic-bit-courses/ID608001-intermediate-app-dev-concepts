from graphene import Field, Int, List
from graphene_django.types import DjangoObjectType
from .models import Question, Choice

class QuestionType(DjangoObjectType):
    class Meta:
        model = Question

class ChoiceType(DjangoObjectType):
    class Meta:
        model = Choice

class Query:
    question = Field(QuestionType, id=Int())
    all_questions = List(QuestionType)
    choice = Field(ChoiceType, id=Int())
    all_choices = List(ChoiceType)

    def resolve_question(self, int, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Question.objects.get(pk=id)
        return None

    def resolve_all_questions(self, info, **kwargs):
        return Question.objects.all()

    def resolve_choice(self, int, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Choice.objects.get(pk=id)
        return None

    def resolve_all_choices(self, info, **kwargs):
        return Choice.objects.select_related('question').all()