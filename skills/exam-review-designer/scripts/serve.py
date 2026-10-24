#!/usr/bin/env python3
"""Optional loopback-only preview using Python's standard library."""
import argparse
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = unquote(urlsplit(self.path).path)
        relative = path.lstrip('/') or 'index.html'
        root = getattr(self, 'root', ROOT)
        try:
            candidate = (root / relative).resolve()
        except (ValueError, OSError):
            self.send_error(400)
            return
        if not candidate.is_relative_to(root) or any(part.startswith('.') for part in Path(relative).parts):
            self.send_error(403)
            return
        if not candidate.is_file():
            self.send_error(404)
            return
        data = candidate.read_bytes()
        mime = mimetypes.guess_type(candidate.name)[0] or 'application/octet-stream'
        if candidate.suffix == '.js':
            mime = 'text/javascript'
        self.send_response(200)
        self.send_header('Content-Type', mime)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=int(os.environ.get('PORT') or 4173))
    parser.add_argument('--root', type=Path, default=ROOT, help='Folder containing the app index.html')
    args = parser.parse_args()
    Handler.root = args.root.resolve()
    if not (Handler.root / 'index.html').is_file():
        parser.error('Choose an app folder containing index.html with --root PATH.')
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    except OSError as error:
        parser.exit(1, f'Cannot open preview port {args.port}: {error}. Keep an existing SoS preview open or choose --port NUMBER.\n')
    print(f'SoS preview: http://127.0.0.1:{server.server_port} (Ctrl+C to stop)', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
