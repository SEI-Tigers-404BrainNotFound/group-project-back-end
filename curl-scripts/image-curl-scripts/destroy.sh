# sh curl-scripts/delete.sh
API="http://localhost:4741"
URL_PATH="/userImages"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Authorization: Bearer ${TOKEN}"

echo
