#!/usr/bin/env bash
if ! ./util_scripts/build_frontend/build_frontend.sh; then
  echo "Frontend build failed."
  exit 1
fi
pip install -r requirements.txt
##if ! yes yes | python manage.py test; then
##  echo "Tests failed."
##  exit 1
##fi
python manage.py collectstatic --no-input
if ! python manage.py migrate; then
  echo "Migration failed."
  exit 1
fi
