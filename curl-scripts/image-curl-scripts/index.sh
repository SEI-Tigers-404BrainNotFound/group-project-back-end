# sh curl-scripts/index.sh
API="http://localhost:4741"
URL_PATH="/userImages"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
