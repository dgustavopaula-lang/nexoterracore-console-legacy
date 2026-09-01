#!/usr/bin/env python3
"""
Servidor local de treinamento do NexoTerraCore Console Next.

- Serve os arquivos estáticos.
- Fornece endpoints MOCK:
  GET /api/health
  GET /api/control-plane
  GET /api/imoveis

Não acessa PostgreSQL real.
Não usa senha real.
Não usa API Key real.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import json
import os

ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", "5502"))

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        original = super().translate_path(path)
        relative = os.path.relpath(original, os.getcwd())
        return str(ROOT / relative)

    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/health":
            return self.send_json({
                "status": "online",
                "database": "mock-local",
                "mode": "training"
            })

        if self.path == "/api/control-plane":
            return self.send_json({
                "organizacao": "Treinamento Local",
                "apiKeys": 1,
                "scopes": "assets.read",
                "rateLimit": "60/min",
                "consumo": 12,
                "consumo24h": 4
            })

        if self.path == "/api/imoveis":
            data = json.loads((ROOT / "data" / "imoveis.json").read_text(encoding="utf-8"))
            return self.send_json(data)

        return super().do_GET()

if __name__ == "__main__":
    os.chdir(ROOT)
    print(f"NexoTerraCore Console Next: http://localhost:{PORT}")
    print("Modo: treinamento local / API mock")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
