import datetime
import json
import requests
import os
from django.http import JsonResponse
from django.shortcuts import render
from requests.packages.urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
bahmni_base_url = os.environ.get('BAHMNI_BASE_URL')


def index(request):
    return render(
        request,
        'index.html',
    )


def allReports(request):
    url = '%s/bahmnireports/allReports' % bahmni_base_url
    response = requests.get(url, verify=False, cookies=(loginAndGetCookies()))
    return JsonResponse(json.loads(response.content), safe=False)


def reportData(request):
    report_name = request.GET.get("name")
    report_params = {"name": report_name, "responseType": "application/json"}

    today = datetime.datetime.now()
    one_year_ago = today.replace(year=today.year - 1)
    report_params["startDate"] = f"{one_year_ago:%Y-%m-%d}"
    report_params["endDate"] = f"{today:%Y-%m-%d}"

    url = '%s/bahmnireports/report' % bahmni_base_url
    response = requests.get(url, verify=False, cookies=(loginAndGetCookies()), params=report_params)
    print(response.content)
    return JsonResponse(json.loads(response.content), safe=False)


def loginAndGetCookies():
    username = os.environ.get('BAHMNI_REPORTS_USERNAME')
    password = os.environ.get('BAHMNI_REPORTS_PASSWORD')
    credentials = {'uname': username, 'pw': password}
    login_url = "%s/openmrs/ms/legacyui/loginServlet" % bahmni_base_url
    login_response = requests.post(login_url, verify=False, params=credentials)
    cookies = login_response.cookies
    return cookies
