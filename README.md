# 2023-ethglobal-paris-be

## Hosting
- `main` branch is currently served at https://ethp.onrender.com/.

## Run
```sh
npm install && npm run migrate && npm start
```

## Test
```sh
npm test
```

## User Endpoints
- `/user/:address`
  - GET: get user id associated with the address
    - 200: uid
    - 404: not found
```sh
curl http://localhost:8080/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F
```
```sh
curl https://ethp.onrender.com/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F
```
  

  - POST: create user address and return the assigned user id; return existing user id if address already registered
    - 200: uid
```sh
curl http://localhost:8080/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F -X POST
```
```sh
curl https://ethp.onrender.com/user/0x71C7656EC7ab88b098defB751B7401B5f6d8976F -X POST
```

- `/user/:address/lottery/:lottery_id`

  - POST: add user to lottery
    - 200:OK, user added if address not found
    - 404: Lottery id not found
  - GET: check if user is in lottery
    - 200: {`true`|`false`}
    - 404: Address or lottery id not found
   
- `/user/:address/lotteries`
  - GET: get list of lotteries that the user joined
    - 200: [{lotteryId, title, description, startTime, endTime, bannerURL, userCount}]
    - 404: Address not found
      
## Lottery Endpoints
- `/lotteries`
  - GET: get all lotteries info
    - 200: [{title, description, startTime, endTime, bannerURL, userCount}]
```sh
curl http://localhost:8080/lotteries
```
```sh
curl https://ethp.onrender.com/lotteries
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
    - 200: lottery_id
    - 400: Empty ttitle
```sh
curl http://localhost:8080/lottery -d "title=First%20Campaign&bannerURL=https%3A%2F%2Ftinyurl.com%2F3jy9ww3w"
```
```sh
curl https://ethp.onrender.com/lottery -d "title=Skyline%20Film%20%E5%B1%8B%E9%A0%82%E9%9B%BB%E5%BD%B1%E9%99%A2%207%E6%9C%88%E5%8F%B0%E5%8C%97%E5%B1%8B%E9%A0%82%E6%94%BE%E6%98%A0%207%2F21(Fri)%20-%207%2F23(Sun)%20%E8%B4%88%E7%A5%A8%E6%B4%BB%E5%8B%95&description=7%E6%9C%88%E7%9A%84%E7%9B%9B%E5%A4%8F%EF%BC%8C%E6%B2%92%E4%BB%80%E9%BA%BC%E6%AF%94%E5%9C%A8%E5%B1%8B%E9%A0%82%E5%96%9D%E6%9D%AF%E5%86%B0%E6%B6%BC%E9%80%8F%E5%BF%83%E7%9A%84%E5%95%A4%E9%85%92%EF%BC%8C%E5%90%83%E8%91%97%E9%A6%99%E5%AB%A9%E5%A4%9A%E6%B1%81%E7%9A%84%E7%BE%8E%E5%BC%8F%E7%87%BB%E8%82%89%EF%BC%8C%E4%BC%B4%E8%91%97%E5%BE%90%E5%BE%90%E5%BE%AE%E9%A2%A8%E8%88%87%E5%A5%BD%E9%9B%BB%E5%BD%B1%EF%BC%8C%E9%82%84%E8%A6%81%E4%BE%86%E5%BE%97%E7%97%9B%E5%BF%AB%E3%80%82%E7%A9%BF%E8%B6%8A%E6%99%82%E7%A9%BA%E8%88%87%E5%B9%B3%E8%A1%8C%E5%AE%87%E5%AE%99%EF%BC%8C%E7%B6%93%E5%85%B8%E4%B8%AD%E7%9A%84%E7%B6%93%E5%85%B8%EF%BC%8C%E9%82%84%E6%9C%89%E8%AE%93%E4%BD%A0%E6%8D%A7%E8%85%B9%E5%A4%A7%E7%AC%91%E7%9A%84%E7%B5%95%E5%A6%99%E5%A5%BD%E6%88%B2%E3%80%82%E5%8F%B0%E5%8C%977%E6%9C%88%E5%B1%8B%E9%A0%82%EF%BC%8C%E6%BB%BF%E8%B6%B3%E4%BD%A0%E5%B0%8D%E5%A5%BD%E9%9B%BB%E5%BD%B1%E7%9A%84%E6%89%80%E6%9C%89%E6%83%B3%E5%83%8F%E3%80%82&startTime=2023-07-08T05%3A00%3A00.000Z&endTime=2023-07-30T05%3A00%3A00.000Z&bannerURL=https://static.accupass.com/eventbanner/2306261712589032454360.jpg"
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
    - 200: {title, description, startTime, endTime, bannerURL, userCount}
    - 404: Lottery id not found
```sh
curl http://localhost:8080/lottery/1
```
```sh
curl https://ethp.onrender.com/lottery/1
```

- `/lottery/:lottery_id/[prizes|missions]`
  - GET: get plain text [prizes|missions] info
  - POST: store plain text [prizes|missions] info
  - field: {data: string(65535)} * `data` has a size limit of `65535`
    - 200: {title, description, startTime, endTime, bannerURL}
    - 404: Lottery id not found
```sh
curl http://localhost:8080/lottery/1/prizes
```
```sh
curl https://ethp.onrender.com/lottery/1/prizes
```

```sh
curl http://localhost:8080/lottery/1/prizes -d "data=%7B%22totalQuantity%22%3A6%2C%22contents%22%3A%5B%7B%22id%22%3A%2243e12767-6f48-47d1-809f-8db917d6ace2%22%2C%22imageURL%22%3A%22https%3A%2F%2Fstatic.accupass.com%2Feventintro%2F2306210815051620670305.jpg%22%2C%22title%22%3A%22%E6%B5%B7%E4%B8%8A%E9%8B%BC%E7%90%B4%E5%B8%AB%20The%20Legend%20of%201900%20%E9%9B%BB%E5%BD%B1%E7%A5%A8%22%2C%22description%22%3A%227%2F21(Fri)%2019%3A00%20(18%3A00%20%E9%96%8B%E6%94%BE%E5%85%A5%E5%A0%B4%20Opens%20at%2018%3A00)%22%2C%22quantity%22%3A2%7D%2C%7B%22id%22%3A%22b15aef15-1a3a-45d5-b73b-1d9f4cc99240%22%2C%22imageURL%22%3A%22https%3A%2F%2Fstatic.accupass.com%2Feventintro%2F2306210815226000364040.jpg%22%2C%22title%22%3A%22%E4%B8%8D%E9%9B%A2%E8%81%B7%E5%86%92%E9%9A%AA%E7%8E%8B%20Irreductible%20%E9%9B%BB%E5%BD%B1%E7%A5%A8%22%2C%22description%22%3A%227%2F21(Fri)%2021%3A50%20(21%3A20%20%E9%96%8B%E6%94%BE%E5%85%A5%E5%A0%B4%20Opens%20at%2021%3A20)%22%2C%22quantity%22%3A2%7D%2C%7B%22id%22%3A%22cc5532d8-deab-4fcd-826a-10ac37a3959f%22%2C%22imageURL%22%3A%22https%3A%2F%2Fstatic.accupass.com%2Feventintro%2F2306210815511462000363.jpg%22%2C%22title%22%3A%22%E5%AA%BD%E7%9A%84%E5%A4%9A%E9%87%8D%E5%AE%87%E5%AE%99%20Everything%20Everywhere%20All%20at%20Once%20%E9%9B%BB%E5%BD%B1%E7%A5%A8%22%2C%22description%22%3A%227%2F22(Sat)%2019%3A00%20(18%3A00%20%E9%96%8B%E6%94%BE%E5%85%A5%E5%A0%B4%20Opens%20at%2018%3A00)%22%2C%22quantity%22%3A2%7D%5D%7D"
```
```sh
curl http://localhost:8080/lottery/1/missions -d "data=%7B%22totalCompletedMissions%22%3A1%2C%22totalRequiredMissions%22%3A2%2C%22missionList%22%3A%5B%7B%22id%22%3A%22f27c1514-abcc-4302-958e-078f9bcaeaae%22%2C%22completed%22%3Atrue%2C%22platform%22%3A%22facebook%22%2C%22action%22%3A%22follow%22%2C%22accountID%22%3A%22Skylinefilm%22%2C%22accountName%22%3A%22Skyline%20Film%20%E5%B1%8B%E9%A0%82%E9%9B%BB%E5%BD%B1%E9%99%A2%22%7D%2C%7B%22id%22%3A%2295644117-2ae0-42e2-b426-e81bd2143729%22%2C%22completed%22%3Afalse%2C%22platform%22%3A%22twitter%22%2C%22action%22%3A%22follow%22%2C%22accountID%22%3A%22SkylineFilms%22%2C%22accountName%22%3A%22Skyline%20Film%20%E5%B1%8B%E9%A0%82%E9%9B%BB%E5%BD%B1%E9%99%A2%22%7D%5D%7D"
```
```sh
curl https://ethp.onrender.com/lottery/1/prizes -d "data=%7B%22totalQuantity%22%3A6%2C%22contents%22%3A%5B%7B%22id%22%3A%2243e12767-6f48-47d1-809f-8db917d6ace2%22%2C%22imageURL%22%3A%22https%3A%2F%2Fstatic.accupass.com%2Feventintro%2F2306210815051620670305.jpg%22%2C%22title%22%3A%22%E6%B5%B7%E4%B8%8A%E9%8B%BC%E7%90%B4%E5%B8%AB%20The%20Legend%20of%201900%20%E9%9B%BB%E5%BD%B1%E7%A5%A8%22%2C%22description%22%3A%227%2F21(Fri)%2019%3A00%20(18%3A00%20%E9%96%8B%E6%94%BE%E5%85%A5%E5%A0%B4%20Opens%20at%2018%3A00)%22%2C%22quantity%22%3A2%7D%2C%7B%22id%22%3A%22b15aef15-1a3a-45d5-b73b-1d9f4cc99240%22%2C%22imageURL%22%3A%22https%3A%2F%2Fstatic.accupass.com%2Feventintro%2F2306210815226000364040.jpg%22%2C%22title%22%3A%22%E4%B8%8D%E9%9B%A2%E8%81%B7%E5%86%92%E9%9A%AA%E7%8E%8B%20Irreductible%20%E9%9B%BB%E5%BD%B1%E7%A5%A8%22%2C%22description%22%3A%227%2F21(Fri)%2021%3A50%20(21%3A20%20%E9%96%8B%E6%94%BE%E5%85%A5%E5%A0%B4%20Opens%20at%2021%3A20)%22%2C%22quantity%22%3A2%7D%2C%7B%22id%22%3A%22cc5532d8-deab-4fcd-826a-10ac37a3959f%22%2C%22imageURL%22%3A%22https%3A%2F%2Fstatic.accupass.com%2Feventintro%2F2306210815511462000363.jpg%22%2C%22title%22%3A%22%E5%AA%BD%E7%9A%84%E5%A4%9A%E9%87%8D%E5%AE%87%E5%AE%99%20Everything%20Everywhere%20All%20at%20Once%20%E9%9B%BB%E5%BD%B1%E7%A5%A8%22%2C%22description%22%3A%227%2F22(Sat)%2019%3A00%20(18%3A00%20%E9%96%8B%E6%94%BE%E5%85%A5%E5%A0%B4%20Opens%20at%2018%3A00)%22%2C%22quantity%22%3A2%7D%5D%7D"
```
```sh
curl https://ethp.onrender.com/lottery/1/missions -d "data=%7B%22totalCompletedMissions%22%3A1%2C%22totalRequiredMissions%22%3A2%2C%22missionList%22%3A%5B%7B%22id%22%3A%22f27c1514-abcc-4302-958e-078f9bcaeaae%22%2C%22completed%22%3Atrue%2C%22platform%22%3A%22facebook%22%2C%22action%22%3A%22follow%22%2C%22accountID%22%3A%22Skylinefilm%22%2C%22accountName%22%3A%22Skyline%20Film%20%E5%B1%8B%E9%A0%82%E9%9B%BB%E5%BD%B1%E9%99%A2%22%7D%2C%7B%22id%22%3A%2295644117-2ae0-42e2-b426-e81bd2143729%22%2C%22completed%22%3Afalse%2C%22platform%22%3A%22twitter%22%2C%22action%22%3A%22follow%22%2C%22accountID%22%3A%22SkylineFilms%22%2C%22accountName%22%3A%22Skyline%20Film%20%E5%B1%8B%E9%A0%82%E9%9B%BB%E5%BD%B1%E9%99%A2%22%7D%5D%7D"
```

- `/lottery/:lottery_id/redeem/:address`
  - GET: get user id and proof for lottery
    - 200: {lotter_id, user_id, user_address, proof}
    - 204: Empty proof
    - 404: Lottery id or Address not found
```
curl http://localhost:8080/lottery/1/redeem/0x71C7656EC7ab88b098defB751B7401B5f6d8976F
```
```
curl https://ethp.onrender.com/lottery/1/redeem/0x71C7656EC7ab88b098defB751B7401B5f6d8976F
```

- `/lottery/:lottery_id/close`
  - `close` function will be automatically executed at lottery end time.
    - 200: OK

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
