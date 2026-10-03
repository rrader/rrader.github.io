---
title: "System test tiers of Heroku on Django"
date: 2013-12-11T15:37:00.001+02:00
lastmod: 2013-12-11T15:40:02.610+02:00
original_url: "https://antigluk.blogspot.com/2013/12/system-test-tiers-of-heroku-on-django.html"
tags: ["django", "heroku", "jenkins", "programming", "python", "qa"]
draft: true
migrated_from: blogspot
---

Task is to ensure that DB, Redis Cache, Worker on RQ (with django-redis-cache) works OK.\
\
Firstly, let's write test functions\
\

## Test functions

### Web-tier

Checking web-tier doesn't require logic, if we get response from app, then web tier works.\
\
def check_web():\
    "Stub function to check web tier"\
    return True\
\

### Checking django cache

Test django cache and Redis connection. Just set and get some value.\
\
TEST_CACHE_KEY = 'key'\
TEST_CACHE_VAL = 'value'\
\
from django.core.cache import cache\
\
def check_cache_set():\
    try:\
        return cache.set(TEST_CACHE_KEY, TEST_CACHE_VAL)\
    except:\
        return False\
\
\
def check_cache_get():\
    try:\
        data = cache.get(TEST_CACHE_KEY)\
        if data != TEST_CACHE_VAL:\
            raise ValueError("invalid value")\
    except:\
        return False\
    return True\
\
\
def check_cache():\
    "Checks is cache works ok"\
    return check_cache_set() and check_cache_get()\
\

### Database connection

To check DB we can simply do some SQL request. Simpliest thing we can do is to retrieve list of tables:\
\
def check_db():\
    from django.db import connection\
    try:\
        connection.introspection.table_names()\
    except:\
        return False\
    return True\
\

### Worker tier

Checks RQ and Worker node\
\
import time\
TIMEOUT = 5  \# seconds\
def check_worker():\
    from globalapp.tasks import ping_task\
    try:\
        start = time.time()\
        job = ping_task.delay("test")\
        while time.time() - start \< TIMEOUT:\
            if job.is_finished:\
                return job.result == 'tset'  \# reversed\
        return False\
    except:\
        return False\
\
Where ping_task is something like\
\@job\
def ping_task(say):\
    return say\[::-1\]\
\
\

## Running tests

\
Approach is to add special view that will run server-side checks. So, firstly add url:\
\
urlpatterns += patterns(\
    'globalapp.views',\
    url(r'\^status/(?P\<check\>\[A-z0-9\]+)/\$', 'status_view', name='status'),\
)\
\
\
View is simply need to choose check-function in respect of 'check' argument and return response with True or False. Here Django REST Framework was used, but it's pretty simple to rewrite to general django app.\
\
from rest_framework.generics import GenericAPIView\
\
import globalapp.checks as checks  \# here your module that contains check functions\
from rest_framework.response import Response\
from rest_framework.permissions import IsAuthenticated\
from rest_framework.authentication import TokenAuthentication\
from rest_framework import status\
from rest_framework.generics import GenericAPIView\
class StatusView(GenericAPIView):\
    permission_classes = (IsAuthenticated, )\
    authentication_classes = (TokenAuthentication, )\
\
    def get(self, request, check):\
        resp = {'name': check}\
        stat = status.HTTP_200_OK\
        check_func = None\
        try:\
            check_func = getattr(checks, 'check\_{}'.format(check))\
        except AttributeError:\
            stat = status.HTTP_400_BAD_REQUEST\
            resp\['error'\] = 'Unknown check'\
        else:\
            resp\['result'\] = check_func()\
        return Response(resp, status=stat)\
\

### Testing framework

To execute tests I use *nosetests*, it's pretty simple to use it and \
\
class HerokuTest(TestCase):\
    def setUp(self):\
        super().setUp()\
        self.base_url = "http://example.com"\
        self.headers = {}\
\
    def check(self, name):\
        conn = requests.get('%s/status/%s/' % (self.base_url, name), headers=self.headers)\
        assert (conn.status_code == 200), "Failed %s tier test" % name\
        r = json.loads(conn.content.decode())\
        assert 'result' in r, "External error"\
        assert r\['result'\], "%s not works" % name\
\
    def test_web(self):\
        self.check('web')\
\
    def test_db(self):\
        self.check('db')\
\
    def test_cache(self):\
        self.check('web')\
\
    def test_worker(self):\
        self.check('worker')\
Here it's very simple to add custom test.\
\

### Integration to Jenkins

It's pretty simple because nosetests can produce results in JUnit format\
\
Add shell command task\
\$ nosetests -v --with-xunit \|\| true\
\
and add post-build task "Publish JUnit" and choose path to nosetests.xml file
