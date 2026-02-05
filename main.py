import os
import sys
import platform
from core.app import app

def main():
    # 1. Check for Gunicorn (Only on non-Windows)
    is_windows = platform.system().lower() == "windows"
    
    if is_windows:
        print("Detected Windows environment. Falling back to Flask development server.")
        print("Running core/app.py directly...")
        
        # Respect environment variable for debug mode
        debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
        app.run(host='0.0.0.0', port=5000, debug=debug_mode)
        
    else:
        print("Detected non-Windows environment. Starting Gunicorn via Python API...")
        
        try:
            from gunicorn.app.base import BaseApplication

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