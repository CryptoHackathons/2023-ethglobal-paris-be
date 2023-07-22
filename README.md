# 2023-ethglobal-paris-be

## Run
`$ npm start`

## Endpoints
- `/`
  -  GET: Showing welcome message
  -  POST: Showing welcome message
     - fields: `{name}`

### User Endpoints
- `/users`
  - [v] GET: [auth required] get the list of users
    - 200: [[username, createTime]]

- `/user`
  - [v] POST: create user or update password
    - fields: {username, password, ?action="create"}
      - 200: [uid]
      - 400: username or password empty

- `/user/:username`
  - [v] GET: [auth required] get user data
    - 200: [username, createTime]

- `/auth`
  - [v] POST: authenticatea user credential
    - fileds: {username, password}
    - 401: username or password not matched
    - 200: OK

## Data models
### User
{
  id
  [v] username
  [v] password
  [] walletAddress
}
