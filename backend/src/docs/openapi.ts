export const openapiSpec = {
  openapi: "3.0.3",
  info: { title: "IncidentHub API", version: "1.0.0" },
  servers: [{ url: "http://localhost:4001", description: "Local" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: {
      LoginBody: { type: "object", required: ["email","password"], properties: {
        email: { type: "string", format: "email" }, password: { type: "string", minLength: 6 }
      }},
      RegisterBody: { type: "object", required: ["email","name","password"], properties: {
        email: { type: "string", format: "email" }, name: { type: "string" }, password: { type: "string", minLength: 6 }, role: { type: "string", enum: ["REPORTER","SUPPORT","ADMIN"] }
      }},
      Service: { type: "object", properties: { id: {type:"string"}, name: {type:"string"} } },
      Incident: { type: "object", properties: {
        id:{type:"string"}, title:{type:"string"}, description:{type:"string"},
        status:{type:"string", enum:["OPEN","INVESTIGATING","RESOLVED"]},
        severity:{type:"string", enum:["LOW","MEDIUM","HIGH","CRITICAL"]},
        serviceId:{type:"string"}, reporterId:{type:"string"}, assigneeId:{type:"string", nullable:true}
      }},
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/login": {
      post: {
        summary: "Login",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginBody" } } } },
        responses: { "200": { description: "OK" }, "401": { description: "Invalid credentials" } }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterBody" } } } },
        responses: { "201": { description: "Created" }, "400": { description: "Invalid data" }, "409": { description:"Email already registered"} }
      }
    },
    "/services": {
      get: { summary: "List services", responses: { "200": { description: "OK" } } },
      post: { summary: "Create service (ADMIN)", responses: { "201": { description:"Created" }, "403": { description:"Forbidden" } } }
    },
    "/incidents": {
      get: { summary: "List incidents (filters: status, service)", responses: { "200": { description: "OK" } } },
      post: { summary: "Create incident", responses: { "201": { description: "Created" }, "400": { description: "Invalid data" }, "404": { description:"Service not found"} } }
    },
    "/incidents/{id}/status": {
      put: { summary: "Update incident status (SUPPORT/ADMIN)", parameters: [{ in:"path", name:"id", required:true, schema:{type:"string"}}],
        responses:{ "200":{description:"OK"}, "400":{description:"Invalid"}, "403":{description:"Forbidden"} } }
    },
    "/incidents/{id}/comment": {
      post: { summary: "Add comment", parameters: [{ in:"path", name:"id", required:true, schema:{type:"string"}}],
        responses:{ "201":{description:"Created"}, "400":{description:"Invalid"}, "404":{description:"Incident not found"} } }
    }
  }
} as const;
