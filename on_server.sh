#!/bin/bash
set -euo pipefail
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
fi
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
if [ -z "\${IS_CUTOMIZED:-}" ]; then
    echo -e "\${RED}Error: You need to reach out to the instructor for running this script\${RESET}"
    echo -e "To run this script, reach out to Jaehoon Song (manual20151276@gmail.com)"

    read -rp "Press Enter to continue after editing the file..."
    exit 1
fi








# --- Dynamic Script Name Identification ---
# Get the base name of this script file, stripping the '.sh' suffix.
# '$0' is the path to the currently running script.
# 'basename' strips directory paths and an optional suffix.


SCRIPT_PATH=$(realpath "$0")            # %~dp0%~nx0 (Full path to script)
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")    # %~dp0 (Directory of script)
SCRIPT_FILE=$(basename "$0")            
SCRIPT_NAME="${SCRIPT_FILE%.*}"         # %~n0 (Filename without extension)
CURRENT_DIR=$PWD














echo "--- Wrapper Script [${GREEN}${SCRIPT_PATH}${RESET}] or [$SCRIPT_NAME] Initializing ---"


# --- Dynamic Script Lookup ---
# Based on the OS, determine the correct suffix for the target script.
OS_SUFFIX=""
case $(uname -s) in
    Linux*)                             OS_SUFFIX="linux" ;;
    Darwin*)                            OS_SUFFIX="osx"   ;;
    CYGWIN*|MINGW*|MSYS*|Windows_NT*)   OS_SUFFIX="win"   ;;
esac
SOURCE_PATH="${SCRIPT_DIR}/scripts/${SCRIPT_NAME}-${OS_SUFFIX}.sh"
echo "Looking for OS-specific script: $GREEN${SOURCE_PATH}$RESET"


# --- Execution Logic with Improved Error Handling ---
# First, check if the target script file and any subdirectories exist.
# The '-f' flag checks for a regular file.


if [ ! -d "${SCRIPT_DIR}/scripts" ]; then
    echo "${YELLOW}Creating directory structure: ${SCRIPT_DIR}/scripts${RESET}"
    mkdir -p "${SCRIPT_DIR}/scripts"
fi


if [ ! -f "${SOURCE_PATH}" ]; then
    
    
    echo "${RED}Error: Target script '${SOURCE_PATH}' was not found.${RESET}"
    echo -e "\tCreating a template file for you..."

    # Use a 'here document' (cat <<EOF) to write a multiline string to the new file.
    cat <<EOF > "${SOURCE_PATH}"
#!/bin/bash
set -euo pipefail
#
# This is an auto-generated template for your OS-specific logic.
# It was created by the wrapper script because the file did not exist.
#
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
fi
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
if [ -z "\${IS_CUTOMIZED:-}" ]; then
    echo -e "\${RED}Error: You need to reach out to the instructor for running this script\${RESET}"
    echo -e "To run this script, reach out to Jaehoon Song (manual20151276@gmail.com)"

    read -rp "Press Enter to continue after editing the file..."
    exit 1
fi


# --- Logic here! ---

echo "Hello from the new, auto-generated script for win!"
echo "You can add your OS-specific commands here."
read -rp "Press Enter to continue after editing the file..."

EOF
    # Confirm creation and tell the user the next step.
    echo -e "\t${GREEN}Successfully created '${SOURCE_PATH}'.${RESET}"
    echo -e "\tPlease add your commands to the new file and then make it executable by running: ${YELLOW}chmod +x ${SOURCE_PATH}${RESET}"
    # pause for user to read
    read -rp "Press Enter to continue after editing the file..."
    exit 1

# Next, if the file exists, check if it has execute permission ('-x').
elif [ ! -x "${SOURCE_PATH}" ]; then
    # The file exists but is not executable. Guide the user to fix it.
    echo "${YELLOW}Error: Target script '${SOURCE_PATH}' was found, but it is not executable.${RESET}"
    echo "Please grant execute permissions by running the following command:"
    echo "${YELLOW}chmod +x ${SOURCE_PATH}${RESET}"
    exit 1

else
    # Success: The file exists and is executable.
    echo "Found executable target script. ${GREEN}Running the found file at ${SOURCE_PATH}...${RESET}"
    echo ""
    echo "${YELLOW}↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓${RESET}"
    # Execute the OS-specific script, passing along any arguments
    # that were given to this wrapper script ('$@').
    # mintty "${SOURCE_PATH}"
    run_terminal "${CURRENT_DIR}" "${SOURCE_PATH}" "$@"
fi










#   {
#     "key": "ctrl+r",
#     "command": "editor.action.insertSnippet",
#     "when": "editorTextFocus && editorLangId == 'shellscript'",
#     "args": { "snippet": "\\${RED}${TM_SELECTED_TEXT}\\${RESET}" }
#   },
#   {
#     "key": "ctrl+g",
#     "command": "editor.action.insertSnippet",
#     "when": "editorTextFocus && editorLangId == 'shellscript'",
#     "args": { "snippet": "\\${GREEN}${TM_SELECTED_TEXT}\\${RESET}" }
#   },
#   {
#     "key": "ctrl+b",
#     "command": "editor.action.insertSnippet",
#     "when": "editorTextFocus && editorLangId == 'shellscript'",
#     "args": { "snippet": "\\${CYAN}${TM_SELECTED_TEXT}\\${RESET}" }
#   },
#   {
#     "key": "ctrl+y",
#     "command": "editor.action.insertSnippet",
#     "when": "editorTextFocus && editorLangId == 'shellscript'",
#     "args": { "snippet": "\\${YELLOW}${TM_SELECTED_TEXT}\\${RESET}" }
#   },

