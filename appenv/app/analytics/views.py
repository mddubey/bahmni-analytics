import datetime
import json
import requests
from django.http import JsonResponse
from django.shortcuts import render
from requests.packages.urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


def index(request):
    return render(
        request,
        'index.html',
    )


def allReports(request):
    url = 'https://192.168.33.20/bahmnireports/allReports'
    response = requests.get(url, verify=False, cookies=(loginAndGetCookies()))
    return JsonResponse(json.loads(response.content), safe=False)


def reportData(request):
    report_name = request.GET.get("name")
    report_params = {"name": report_name, "responseType": "application/json"}

    today = datetime.datetime.now()
    one_year_ago = today.replace(year=today.year - 1)
    report_params["startDate"] = f"{one_year_ago:%Y-%m-%d}"
    report_params["endDate"] = f"{today:%Y-%m-%d}"

    url = 'https://192.168.33.20/bahmnireports/report'
    response = requests.get(url, verify=False, cookies=(loginAndGetCookies()), params=report_params)
    print(response.content)
    return JsonResponse(json.loads(response.content), safe=False)


def loginAndGetCookies():
    credentials = {'uname': 'random', 'pw': 'aurrandom'}
    login_url = "https://192.168.33.20/openmrs/ms/legacyui/loginServlet"
    login_response = requests.post(login_url, verify=False, params=credentials)
    cookies = login_response.cookies
    return cookies
