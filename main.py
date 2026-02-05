import os
import sys
import subprocess
import platform

def install_package(package_name):
    print(f"Installing {package_name}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])

def main():
    # 1. Check for Gunicorn (Only on non-Windows)
    is_windows = platform.system().lower() == "windows"
    
    if not is_windows:
        try:
            import gunicorn
            print("Gunicorn is already installed.")
        except ImportError:
            print("Gunicorn not found.")
            install_package("gunicorn")

    # 2. Execution
    if is_windows:
        print("Detected Windows environment. Falling back to Flask development server (or Waitress if configured).")
        print("Running core/app.py directly...")
        
        # Import and run the app from core
        from core.app import app
        
        # Respect environment variable for debug mode
        debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
        app.run(host='0.0.0.0', port=5000, debug=debug_mode)
        
    else:
        print("Detected non-Windows environment. Starting Gunicorn...")
        
        # Construct Gunicorn command
        # -w 4: 4 worker processes
        # -b 0.0.0.0:5000: Bind to all interfaces on port 5000
        # --chdir .: Ensure we are running from root
        # core.app:app : The application object
        cmd = [
            "gunicorn",
            "-w", "4",
            "-b", "0.0.0.0:5000",
            "core.app:app"
        ]
        
        # Use subprocess to replace current process with gunicorn or run it
        # Using subprocess.run to keep this script as the parent wrapper
        try:
            subprocess.run(cmd, check=True)
        except KeyboardInterrupt:
            print("\nServer stopped.")
        except subprocess.CalledProcessError as e:
            print(f"Gunicorn failed with error: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()