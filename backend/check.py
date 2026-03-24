import urllib.request
try:
    urllib.request.urlopen("http://127.0.0.1:8000", timeout=2)
    print("UP")
except Exception as e:
    print("DOWN:", e)
