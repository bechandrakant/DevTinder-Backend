# Dev Tinder

Similar to Tinder but for developers

### API List

- authRouter

  - [x] POST /signup
  - [x] POST /login
  - [x] POST /logout

- profileRouter

  - [x] GET /profile/view
  - [x] PATCH /profile/edit
  - [x] PATCH /profile/password

- connectionRequestRouter (Status: ignore, interested, accepeted, rejected)

  - [x] POST /request/send/:status/:userId (status: ignored, interested)
  - [x] PATCH /request/review/:status/:requestId (status: accepeted, rejected)

- userRouter

  - [ ] GET /user/connections
  - [ ] GET /user/requests
  - [ ] GET /user/feed - Gets you the profiles of other users on platform
