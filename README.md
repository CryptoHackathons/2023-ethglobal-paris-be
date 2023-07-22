# 2023-ethglobal-paris-be

## Run
`$ npm start`

### User Endpoints
- `/user/:address`
  - GET: get user id associated with the address
    - 200: uid
    - 404: not found
  - POST: create user address and return the assigned user id; return existing user id if address already registered
    - 200: uid

- `/lotteries/`
  - GET: get all lotteries info
    - 200: [{title, description, startTime, endTime, bannerURL}]

- `/lottery/`
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

- `/lottery/:lottery_id`
  - GET: get lottery info
    - 200: {title, description, startTime, endTime, bannerURL}
    - 404: Lottery id not found

- `/lottery/:lottery_id/[prizes|missions]`
  - GET: get plain text [prizes|missions] info
  - POST: store plain text [prizes|missions] info
    - 200: {title, description, startTime, endTime, bannerURL}
    - 404: Lottery id not found

- `/lottery/:lottery_id/close`
  - GET: trigger `closeLotterytAndCallChainlinkCoordinator()`
    - 200: OK

- `/lottery/:lottery_id/redeem/:address`
  - GET: get user id and proof for lottery
    - 200: {lotter_id, user_id, user_address, proof}

## Data models
### User
{
  id
  address
}

### lottery
{
  title,
  description,
  startTime,
  endTime,
  bannerURL
  proof,
  prizes: json,
  missions: json,
}