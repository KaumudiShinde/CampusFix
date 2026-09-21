# pyrefly: ignore [missing-import]
from django.contrib import admin
# pyrefly: ignore [missing-import]
from django.urls import path, include 
# pyrefly: ignore [missing-import]
from django.conf import settings
# pyrefly: ignore [missing-import]
from django.conf.urls.static import static
# pyrefly: ignore [missing-import]
from django.http import HttpResponse

def root_view(request):
    html = """
    <html>
      <head>
        <title>CampusFix Backend API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 2.5rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); max-width: 520px; border: 1px solid #334155; }
          h1 { color: #38bdf8; margin-top: 0; font-size: 1.5rem; }
          p { color: #94a3b8; line-height: 1.5; font-size: 0.95rem; }
          .btn-primary { display: block; background: #2563eb; color: #fff; text-align: center; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: 600; margin: 1.2rem 0; transition: 0.2s; }
          .btn-primary:hover { background: #1d4ed8; }
          .links { list-style: none; padding: 0; margin: 1rem 0 0 0; }
          .links li { margin-bottom: 0.5rem; }
          .links a { color: #38bdf8; text-decoration: none; font-size: 0.9rem; }
          .links a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🏛️ CampusFix Backend is Running!</h1>
          <p>This is the <strong>Django REST API backend</strong> (port 8000). Your main web application UI is running on the Vite frontend server.</p>
          <a class="btn-primary" href="http://localhost:3000">👉 Open Web App (http://localhost:3000)</a>
          <p><strong>Available Endpoints:</strong></p>
          <ul class="links">
            <li>🔗 <a href="/admin/">Django Admin Panel (/admin/)</a></li>
            <li>🔗 <a href="/api/complaints/">Complaints API (/api/complaints/)</a></li>
            <li>🔗 <a href="/api/stats/">Analytics API (/api/stats/)</a></li>
          </ul>
        </div>
      </body>
    </html>
    """
    return HttpResponse(html)

urlpatterns = [
    path('', root_view, name='root-view'),
    path('admin/', admin.site.urls),
    path('api/', include('complaints.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
