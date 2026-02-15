from django.http import HttpResponse

def health(request):
    return HttpResponse("ok")

def home(request):
    return HttpResponse("Server running")