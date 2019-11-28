#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECTS_DIR_PATH=/home/marc/projects
FRONTEND_PROJECT_DIR_PATH="${PROJECTS_DIR_PATH}/castspot_frontend"
BACKEND_PROJECT_DIR_PATH="${PROJECTS_DIR_PATH}/castspot"
BACKEND_STATIC_FOLDER="${BACKEND_PROJECT_DIR_PATH}/static"

cd $FRONTEND_PROJECT_DIR_PATH || exit 1
yarn build
python "${DIR}/move_files.py"
python "${DIR}/sanitise_index_html.py"
