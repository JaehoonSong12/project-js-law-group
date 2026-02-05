import os
import sys
import platform
from core.app import app

def main():
    # 1. Check for Gunicorn (Only on non-Windows)
    is_windows = platform.system().lower() == "windows"
    
    if is_windows:
        print("Detected Windows environment.")
        
        # Respect environment variable for debug mode
        debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

        if debug_mode:
            print("Debug mode enabled. Running with Flask Development Server...")
            app.run(host='0.0.0.0', port=5000, debug=True)
        else:
            # Production Mode on Windows -> Use Waitress
            try:
                from waitress import serve
                print("Starting Waitress (Production WSGI Server for Windows).")
                print("Serving on http://0.0.0.0:5000 (Accessible via http://localhost:5000 or your LAN IP)")
                serve(app, host='0.0.0.0', port=5000)
            except ImportError:
                print("Waitress not installed. Falling back to Flask Development Server.")
                print("TIP: For production on Windows, install waitress: pip install waitress")
                app.run(host='0.0.0.0', port=5000, debug=False)
        
    else:
        print("Detected non-Windows environment. Starting Gunicorn via Python API...")
        
        try:
            from gunicorn.app.base import BaseApplication
            import gunicorn.glogging  # Explicit import to help PyInstaller

            class StandaloneApplication(BaseApplication):
                def __init__(self, app, options=None):
                    self.application = app
                    self.options = options or {}
                    super().__init__()

                def load_config(self):
                    config = {key: value for key, value in self.options.items()
                              if key in self.cfg.settings and value is not None}
                    for key, value in config.items():
                        self.cfg.set(key.lower(), value)

                def load(self):
                    return self.application

            options = {
                'bind': '0.0.0.0:5000',
                'workers': 4,
            }
            
            StandaloneApplication(app, options).run()
            
        except ImportError:
            print("Gunicorn not found in environment. Please install it with 'pip install gunicorn'.")
            sys.exit(1)
        except Exception as e:
            print(f"Failed to start Gunicorn: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()