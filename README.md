# 2023-ethglobal-paris-be

## Run
`$ node app.js`

## Endpoints
- `/`
  -  GET: Showing welcome message
  -  POST: Showing welcome message
     - fields: `{name}`

### User Endpoints
- `/users`
  - GET: [auth required] 
    - 200: [[username, createTime]]

- `/user`
  - POST:
    - fields: {*username, *password, action="create"}
      - 200: [uid]
      - 400: username or password empty

- `/user/:username`
  - GET: [auth required]
    - 200: [username, createTime]

- `/auth`
  - POST:
    - fileds: {*username, *password}
    - 403: username or password not matched
    - 200: OK