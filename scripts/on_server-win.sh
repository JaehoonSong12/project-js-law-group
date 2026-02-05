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

on_pvm

cd "$TEMP" || exit




# # pip install flask
# python server.py
pip install waitress
python main.py



read -rp "Press Enter to continue after editing the file..."

