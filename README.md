# REST API sample to handle GitHub Issues


## Setup

- Sign-in to GitHub : https://github.com/

- Navigate from upper-right menu: Settings - Developer settings - OAuth Apps - New OAuth App

- Input App name, Homepage URL(`http://localhost:8080` for example), Callback URL(`http://localhost:8080/callback` for example), and click **Create OAuth App** button. 

- Copy `client_id`, (generated)`client_secret`, and `callback_url`, then specify them as environment values of CLIENT_ID, CLIENT_SECRET, and CALLBACK_URL when execute application.


## APIs

- `GET /api/github/issues/:user/:repo`

  - Get issues of `:user/:repo` repository.

  - Query parameters:

    - `filter` : Indicates which sorts of issues, one of those: [ 'assigned', 'created', 'mentioned', 'subscribed', 'repos', 'all' ]

    - `state` : Status of issue, one of those: [ 'all', 'open', 'closed' ]

    - `labels` : List of comma separated label names

    - `token` : Specify OAuth2 token or Personal access token, which is needed if repository would be private.

- `GET /api/github/comments/:user/:repo`

  - Get comments of `:user/:repo` repository.

  - Query parameters:

    - `issue_num` : Specify one issue by number

    - `token` : Specify OAuth2 token or Personal access token, which is needed if repository would be private.


## Licensing

This code is licensed under MIT.


## Copyright

2022 K.Kimura @ Juge.Me all rights reserved.

