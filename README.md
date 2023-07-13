# 2023-ethglobal-paris-be

## Hosting
- `main` branch is currently served at https://ethp.onrender.com/.

## Run
```
$ npm install && npm run migrate && npm start
```

## Test
```
$ npm test
```

## User Endpoints
- `/user/:address`
  - GET: get user id associated with the address
    - 200: uid
    - 404: not found
```
$ curl http://localhost:8080/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F
```
```
$ curl https://ethp.onrender.com/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F
```
  

  - POST: create user address and return the assigned user id; return existing user id if address already registered
    - 200: uid
```
$ curl http://localhost:8080/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F -X POST
```
```
$ curl https://ethp.onrender.com/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F -X POST
```

- `/lotteries`
  - GET: get all lotteries info
    - 200: [{title, description, startTime, endTime, bannerURL}]
```
$ curl http://localhost:8080/lotteries
```
```
$ curl https://ethp.onrender.com/lotteries
```

- `/lottery`
  - POST: create new lottery
  - fields: {
    title,
    ?description,
    ?startTime = createTime,
    ?endTime,
    ?bannerURL,
  }
    - 200: {lottery_id}
    - 400: Empty ttitle
```
$ curl http://localhost:8080/lottery -d "title=First%20Campaign&bannerURL=https%3A%2F%2Ftinyurl.com%2F3jy9ww3w"
```
```
$ curl https://ethp.onrender.com/lottery -d "title=First%20Campaign&bannerURL=https%3A%2F%2Ftinyurl.com%2F3jy9ww3w"
```

- `/lottery/:lottery_id`
  - POST: update lottery info
    - fields: {
      ?title, 
      ?description, 
      ?startTime, 
      ?endTime, 
      ?bannerURL
      }
      - 200: OK
      - 404: Lottery id not found
  - GET: get lottery info
    - 200: {title, description, startTime, endTime, bannerURL}
    - 404: Lottery id not found
```
$ curl http://localhost:8080/lottery/1
```
```
$ curl https://ethp.onrender.com/lottery/1
```

- `/lottery/:lottery_id/[prizes|missions]`
  - GET: get plain text [prizes|missions] info
  - POST: store plain text [prizes|missions] info
  - field: {data}
    - 200: {title, description, startTime, endTime, bannerURL}
    - 404: Lottery id not found
```
$ curl http://localhost:8080/lottery/1/prizes
```
```
$ curl https://ethp.onrender.com/lottery/1/prizes
```

```
$ curl http://localhost:8080/lottery/1/prizes -d "data={[%22id%22%3A%22%22%2C%22title%3A%22gold%22%2C%22description%22%3A%22something+good%22]}"
```
```
$ curl https://ethp.onrender.com/lottery/1/prizes -d "data={[%22id%22%3A%22%22%2C%22title%3A%22gold%22%2C%22description%22%3A%22something+good%22]}"
```

- [WIP] `/lottery/:lottery_id/close`
  - GET: trigger `closeLotterytAndCallChainlinkCoordinator()`
    - 200: OK

- [WIP] `/lottery/:lottery_id/redeem/:address`
  - GET: get user id and proof for lottery
    - 200: {lotter_id, user_id, user_address, proof}

## Data models
### User
{
  - id,
  - address,
}

### lottery
{
  - title,
  - description,
  - startTime,
  - endTime,
  - bannerURL
  - proof,
  - prizes: json,
  - missions: json,
}
