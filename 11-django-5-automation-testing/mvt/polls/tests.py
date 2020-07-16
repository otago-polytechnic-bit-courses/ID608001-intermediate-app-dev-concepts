from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from .models import Question

class TestQuestionModel(TestCase):
    def test_was_published_recently_with_future_question(self):
        time = timezone.now() + timedelta(days=30)
        future_question = Question(pub_date=time)
        self.assertFalse(future_question.was_published_recently())

    def test_was_published_recently_with_old_question(self):
        time = timezone.now() - timedelta(days=1, seconds=1)
        old_question = Question(pub_date=time)
        self.assertFalse(old_question.was_published_recently())

    def test_was_published_recently_with_recent_question(self):
        time = timezone.now() - timedelta(hours=23, minutes=59, seconds=59)
        recent_question = Question(pub_date=time)
        self.assertTrue(recent_question.was_published_recently())
    
def create_question(question_text, days):
    time = timezone.now() + timedelta(days=days)
    return Question.objects.create(question_text=question_text, pub_date=time)

class TestQuestionIndexView(TestCase):
    def test_no_questions(self):
        response = self.client.get(reverse('polls:index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'No polls are available.')
        self.assertQuerysetEqual(response.context['latest_question_list'], [])

    def test_past_question(self):
        create_question(question_text='Did you enjoy class today?', days=-30)
        response = self.client.get(reverse('polls:index'))
        self.assertQuerysetEqual(
            response.context['latest_question_list'],
            ['<Question: Did you enjoy class today?>']
        )

    def test_future_question(self):
        create_question(question_text='What is your favourite course?', days=30)
        response = self.client.get(reverse('polls:index'))
        self.assertContains(response, 'No polls are available.')
        self.assertQuerysetEqual(response.context['latest_question_list'], [])

    def test_future_question_and_past_question(self):
        create_question(question_text='Did you enjoy class today?', days=-30)
        create_question(question_text='What is your favourite course?', days=30)
        response = self.client.get(reverse('polls:index'))
        self.assertQuerysetEqual(
            response.context['latest_question_list'],
            ['<Question: Did you enjoy class today?>']
        )

    def test_two_past_questions(self):
        create_question(question_text='Did you enjoy class today?', days=-30)
        create_question(question_text='Who is your favourite teacher?', days=-5)
        response = self.client.get(reverse('polls:index'))
        self.assertQuerysetEqual(
            response.context['latest_question_list'],
            ['<Question: Who is your favourite teacher?>', '<Question: Did you enjoy class today?>']
        )

class TestQuestionDetailView(TestCase):
    def test_future_question(self):
        future_question = create_question(question_text='What is your favourite course?', days=30)
        url = reverse('polls:detail', args=(future_question.id,))
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_past_question(self):
        past_question = create_question(question_text='Did you enjoy class today?', days=-30)
        url = reverse('polls:detail', args=(past_question.id,))
        response = self.client.get(url)
        self.assertContains(response, past_question.question_text)

class TestSelenium(StaticLiveServerTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.driver = webdriver.Chrome('polls/chromedriver')

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        super().tearDownClass()

    def test_python_org_search(self):
        self.driver.get('https://www.python.org')
        self.assertTrue('Python' in self.driver.title)
        elem = self.driver.find_element_by_name('q')
        elem.clear()
        elem.send_keys('pycon')
        elem.send_keys(Keys.RETURN)
        self.assertTrue('No results found.' not in self.driver.page_source)