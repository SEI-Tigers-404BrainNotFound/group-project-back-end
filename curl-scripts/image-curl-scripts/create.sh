# sh curl-scripts/create.sh
API="http://localhost:4741"
URL_PATH="/userImages"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "userImage": {
      "fileName": "'"${FILENAME}"'",
      "tag": "'"${TAG}"'",
      "description": "'"${DESCRIPTION}"'"
    }
  }'
