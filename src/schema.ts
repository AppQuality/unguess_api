openapi: 3.1.0
info:
  title: UnguessApi
  version: '1.0'
  description: An API to get all data for your bugfinding and ux research needs!
  contact:
    name: Developers
    email: it@unguess.io
servers:
  - url: 'https://api.unguess.io'
paths:
  /:
    get:
      summary: Get API description
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties: {}
      operationId: get-root
      description: Get all routes available for this apis
    parameters: []
  /authenticate:
    post:
      description: A request to login with your username and password
      summary: Authenticate to the API
      operationId: post-authenticate
      responses:
        '200':
          $ref: '#/components/responses/Authentication'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                type: string
              examples:
                example-1:
                  value: string
      tags:
        - Authentication
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
              required:
                - username
                - password
            examples:
              example:
                value:
                  username: Elon71
                  password: my-strong-password
        description: A JSON containing username and password
      parameters: []
  /users/me:
    get:
      summary: Get user data
      tags:
        - User
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '201':
          description: Created
        '403':
          $ref: '#/components/responses/NotAuthorized'
        '404':
          $ref: '#/components/responses/NotFound'
      operationId: get-users-me
      security:
        - JWT: []
  /workspaces:
    get:
      summary: Your GET endpoint
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Workspace'
      operationId: get-workspaces
      parameters: []
      security:
        - JWT: []
  '/workspaces/{wid}':
    parameters:
      - schema:
          type: integer
        name: wid
        in: path
        required: true
        description: Workspace (company) id
    get:
      summary: Your GET endpoint
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Workspace'
      operationId: get-workspace
      parameters: []
      security:
        - JWT: []
  '/workspaces/{wid}/campaigns':
    parameters:
      - schema:
          type: integer
        name: wid
        in: path
        required: true
        description: Workspace (company) id
    get:
      summary: Your GET endpoint
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Campaign'
      operationId: get-workspace-campaigns
      security:
        - JWT: []
  '/workspaces/{wid}/projects':
    parameters:
      - schema:
          type: integer
        name: wid
        in: path
        required: true
        description: Workspace (company) id
    get:
      summary: Your GET endpoint
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Project'
      operationId: get-workspace-projects
      security:
        - JWT: []
  '/workspaces/{wid}/projects/{pid}':
    parameters:
      - schema:
          type: integer
        name: wid
        in: path
        required: true
        description: Workspace (company) id
      - schema:
          type: integer
        name: pid
        in: path
        required: true
        description: Project id
    get:
      summary: Your GET endpoint
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Project'
      operationId: get-workspace-project
  '/workspaces/{wid}/projects/{pid}/campaigns':
    parameters:
      - schema:
          type: integer
        name: wid
        in: path
        required: true
        description: Workspace (company) id
      - schema:
          type: integer
        name: pid
        in: path
        required: true
        description: Project id
    get:
      summary: Your GET endpoint
      tags: []
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Campaign'
      operationId: get-workspace-project-campaigns
components:
  schemas:
    User:
      title: User
      type: object
      description: ''
      x-examples:
        example-1:
          value:
            username: string
            name: string
            surname: string
            email: user@example.com
            image: 'http://example.com'
            id: 0
            wp_user_id: 0
            role: string
            is_verified: true
      properties:
        id:
          type: integer
        email:
          type: string
          format: email
        role:
          type: string
        name:
          type: string
        workspaces:
          type: array
          items:
            $ref: '#/components/schemas/Workspace'
        profile_id:
          type: integer
        tryber_wp_user_id:
          type: integer
      required:
        - id
        - email
        - role
        - name
        - workspaces
    Workspace:
      title: Workspace
      type: object
      properties:
        id:
          type: integer
        company:
          type: string
        tokens:
          type: number
        logo:
          type: string
      required:
        - id
        - company
        - tokens
    Campaign:
      title: Campaign
      type: object
      properties:
        id:
          type: integer
        start_date:
          type: string
        end_date:
          type: string
        close_date:
          type: string
        title:
          type: string
        customer_title:
          type: string
        description:
          type: string
        status_id:
          type: number
        is_public:
          type: number
        campaign_type_id:
          type: integer
        project_id:
          type: integer
        project_name:
          type: string
      required:
        - id
        - start_date
        - end_date
        - close_date
        - title
        - customer_title
        - description
        - status_id
        - is_public
        - campaign_type_id
        - project_id
        - project_name
    Project:
      title: Project
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        campaigns_count:
          type: integer
      required:
        - id
        - name
        - campaigns_count
  securitySchemes:
    JWT:
      type: http
      scheme: bearer
      description: ''
  responses:
    Authentication:
      description: Authentication data. The token can be used to authenticate the protected requests
      content:
        application/json:
          schema:
            type: object
            properties:
              id:
                type: number
              firstName:
                type: string
              lastName:
                type: string
              token:
                type: string
              username:
                type: string
          examples:
            example:
              value:
                id: 42
                firstName: Elon
                lastName: Musk
                token: my-jwt-token
                username: Elon71
    NotFound:
      description: An error due to the resource not existing
      content:
        application/json:
          schema:
            type: object
            properties:
              element:
                type: string
              id:
                type: integer
              message:
                type: string
            required:
              - element
              - id
              - message
          examples:
            example-1:
              value:
                element: campaign
                id: 1
                message: No campaign with id 1
    MissingParameters:
      description: An error due to missing required parameters
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
            required:
              - message
          examples:
            example:
              value:
                message: Missing parameters
    NotAuthorized:
      description: An error due to insufficient authorization to access the resource
      content:
        application/json:
          schema:
            type: object
            properties:
              message:
                type: string
          examples:
            example:
              value:
                message: Not Authorized.
  parameters:
    campaign:
      name: campaign
      in: path
      required: true
      schema:
        type: string
      description: A campaign id
    task:
      name: task
      in: path
      required: true
      schema:
        type: string
      description: A task id
    customer:
      name: customer
      in: path
      required: true
      schema:
        type: string
      description: A customer id
    project:
      name: project
      in: path
      required: true
      schema:
        type: string
      description: A project id
    limit:
      name: limit
      in: query
      required: false
      schema:
        type: integer
      description: Max items to retrieve
    start:
      name: start
      in: query
      required: false
      schema:
        type: integer
      description: Items to skip for pagination
    filterBy:
      name: filterBy
      in: query
      required: false
      schema:
        type: object
      description: Key-value Array for item filtering
    order:
      name: order
      in: query
      required: false
      schema:
        type: string
        enum:
          - ASC
          - DESC
        default: DESC
      description: 'How to order values (ASC, DESC)'
    locale:
      name: locale
      in: query
      required: false
      schema:
        type: string
        enum:
          - en
          - it
        default: en
      description: How to localize values
    searchBy:
      name: searchBy
      in: query
      schema:
        type: string
      description: A comma separated list of fields which will be searched
    search:
      name: search
      in: query
      required: false
      schema:
        type: string
      description: The value to search for
tags:
  - name: Authentication
  - name: Campaign
  - name: Customer
  - name: Projects
  - name: Task
  - name: User
  - name: Admin
  - name: Devices