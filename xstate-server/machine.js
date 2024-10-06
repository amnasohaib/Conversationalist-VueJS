const {
  createMachine,
  assign,
  spawn,
  sendParent,
} = require("xstate");

const fetch = (url, options) =>
  import("node-fetch").then(({ default: fetch }) => fetch(url, options));

const toggleMachine = createMachine(
  {
    initial: "Authenticated",
    context: {},
    states: {
      Authenticated: {
        on: {
          SIGNUP: {
            target: "SIGNUP_DB",
            actions: [
              assign({
                username: (_context, event) => event.value.username,

                email: (_context, event) => event.value.email,

                password: (_context, event) => event.value.password,
              }),
            ],
          },
          LOGIN: {
            target: "LOGIN_DB",
            actions: [
              assign({
                email: (_context, event) => event.value.email,

                password: (_context, event) => event.value.password,
              }),
            ],
          },
        },
      },

      LOGIN_DB: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              "http://localhost:3550/api/users/login",
              "POST",
              {
                email: context.email,
                password: context.password,
              },
              "FETCH_SUCCESS",
              "Error"
            );
          },
        ],
        on: {
          FETCH_SUCCESS: {
            actions: [
              assign({
                users: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "Authenticated",
          },
        },
      },
      SIGNUP_DB: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              "http://localhost:3550/api/users/",
              "POST",
              {
                username: context.username,
                email: context.email,
                password: context.password,
              },
              "FETCH_SUCCESS",
              "Error"
            );
          },
        ],
        on: {
          FETCH_SUCCESS: {
            target: "LoggedIn",
            actions: ["sendCtx"],
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "Authenticated",
          },
        },
      },

      LoggedIn: {
        type: "final"
      },

      Final: {
        type: "Final",
      },
    },
  },
  {
    actions: {
      receiveMessage: assign({
        errorMessage: (_context, event) => event.ErrorMessage,
        mBoolean: true,
      }),
      spawnFetch: assign({
        fetchSrc: () => spawn(Fetch_Machine),
        mBoolean: false,
      }),
    },
  }
);

const Fetch_Machine = createMachine(
  {
    id: "FETCH",
    initial: "Idle",
    context: {},
    states: {
      Idle: {
        on: {
          FETCH2: {
            target: "GetData2",
            actions: [
              "recieveUrl",
              "recieveparameter",
              "recievenexttransition",
              "recievefailuretransition",
            ],
          },
        },
      },
      GetData2: {
        invoke: {
          id: "GetData",
          src: "getData",
          onDone: {
            target: "Final",
            actions: sendParent((context, _event) => ({
              ...context,
              type: context.success,
            })),
          },
          onError: {
            target: "Final",
            actions: sendParent((context, _event) => ({
              ...context,
              type: context.failure,
            })),
          },
        },
      },

      Final: {
        type: "final",
      },
    },
  },
  {
    services: {
      // ---------------------------------
      getData: async (context, _event) => {
        console.log(`URL =  ${context.url}`);
        console.log(`Parameters = ${JSON.stringify(context.parameters)}`);
        console.log(`Request = ${context.request}`);
        return fetch(context.url, {
          method: context.request,
          ...(context.request == "POST" && {
            body: JSON.stringify(context.parameters),
          }),

          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        })
          .then((response) => {
            if (response.status != 200) {
              throw new Error(response.status);
            } else {
              return response.json();
            }
          })
          .then((data) => {
            console.log(`API Response: ${JSON.stringify(data)}`);
            if (data.mBoolean == true) {
              throw new Error(data.errorMessage);
            } else if (data[0]) {
              if (data[0].validate == false) {
                throw new Error(data[0].message);
              }
            } else if (data.validate == false) {
              console.log("Validate", data.message);
              throw new Error(data.message);
            }
            context.result = data;
          })
          .catch((e) => {
            context.ErrorMessage = e.message;
            assign({
              ErrorMessage: (e) => e.message,
            });
            console.log(`Service Machine Error = ${context.ErrorMessage}`);
            return Promise.reject();
          });
      },
    },
    actions: {
      recieveUrl: assign({
        url: (_context, event) => {
          return event.value.url;
        },
        request: (_context, event) => event.value.request,
      }),
      recieveparameter: assign({
        parameters: (_context, event) => {
          return event.value.parameter;
        },
      }),
      recievenexttransition: assign({
        success: (_context, event) => {
          return event.value.success;
        },
      }),
      recievefailuretransition: assign({
        failure: (_context, event) => {
          return event.value.failure;
        },
      }),
    },
  }
);

const trigger = (
  context,
  url,
  request,
  parameter,
  success,
  failure
) => {
  context.fetchSrc.send({
    type: "FETCH2",
    value: { url, request, parameter, success, failure },
  });
};

module.exports = toggleMachine;