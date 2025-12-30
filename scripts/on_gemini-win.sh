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
if [ -z "${IS_CUTOMIZED:-}" ]; then
    echo -e "${RED}Error: You need to reach out to the instructor for running this script${RESET}"
    echo -e "To run this script, reach out to Jaehoon Song (manual20151276@gmail.com)"

    read -rp "Press Enter to continue after editing the file..."
    exit 1
fi












# --- Logic here! ---

TEMP=$PWD
cd .. || exit


on_kt     # JAVA/Kotlin
on_gradle # Gradle
on_v8     # Node.js
on_pvm    # Python (replaced with ./on_venv.sh)


cd "$TEMP" || exit







# instuctions
echo -e "${CYAN}To get started with Gemini CLI on Windows, see these usages:${RESET}"
echo -e "${YELLOW}\tUsages:${RESET}"

echo -e "${YELLOW}1.${RESET} Install Gemini CLI via npm (Node.js package manager):"
echo -e "\t${GREEN}npm install -g @google/gemini-cli${RESET}"
echo -e "${YELLOW}2.${RESET} Check the installation and version:"
echo -e "\t${GREEN}gemini --version${RESET}"
echo -e "${YELLOW}3.${RESET} Basic command usages:"
echo -e "\t${GREEN}gemini help${RESET} - Display help information about Gemini CLI commands."
echo -e "\t${GREEN}gemini list models${RESET} - List available Gemini models."
echo -e "\t${GREEN}gemini chat${RESET} - Start an interactive chat session with Gemini."
echo -e "\t${GREEN}gemini generate image --prompt \"A sunset over a mountain range\"${RESET} - Generate an image based on the provided prompt."
echo -e "${YELLOW}4.${RESET} Basic command usages:"
echo -e "\t${GREEN}gemini chat${RESET} - interactive chat session with Gemini"
echo -e "\t${GREEN}gemini generate image --prompt \"A futuristic cityscape at dusk\"${RESET} - Generate an image from a text prompt"
echo -e "\t${GREEN}gemini -p 'What is the capital of France?'${RESET} - Using Quotes"
echo -e "\t${GREEN}gemini -p \"Explain the code in this file\" main.py${RESET} - Code Explanation"



npm install -g @google/gemini-cli

# gemini
gemini --model gemini-3-pro-preview

read -rp "Press Enter to continue after editing the file..."

