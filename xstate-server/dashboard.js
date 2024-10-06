const {
  createMachine,
  assign,
  spawn,
  sendParent,
} = require("xstate");

const dashboardMachine = createMachine(
  {
    id: "dashboard",
    initial: "LoggedIn",
    context: {},
    states: {
      LoggedIn: {
        on: {
          GETPOSTS: {
            target: "GetHomePosts",
            actions: [],
          },

          GETSPECIFICUSER: {
            target: "GetSpecificUser",
            actions: [
              assign({
                userId: (_context, event) => event.value.userId,
              }),
            ],
          },

          UPDATEUSER: {
            target: "UpdateUser",
            actions: [
              assign({
                userId: (_context, event) => event.value.userId,

                user: (_context, event) => event.value.user,

              }),
            ],
          },


          ADDPOST: {
            target: "AddPost",
            actions: [
              assign({
                username: (_context, event) => event.value.username,

                description: (_context, event) => event.value.description,

                myFile: (_context, event) => event.value.myFile,
              }),
            ],
          },

          DELETEPOST: {
            target: "DeletePost",
            actions: [
              assign({
                id: (_context, event) => event.value.id,
              }),
            ],
          },

          UPDATEPOST: {
            target: "UpdatePost",
            actions: [
              assign({
                post: (_context, event) => event.value.post,
              }),
            ],
          },

          LIKEPOST: {
            target: "LikePost",
            actions: [
              assign({
                PostId: (_context, event) => event.value.PostId,
                
                UserId: (_context, event) => event.value.UserId
                
              }),
            ],
          },

          
          GETCOMMENTS: {
            target: "GetComments",
            actions: [
              assign({
                PostId: (_context, event) => event.value.PostId,
              }),
            ],
          },
          
          POSTCOMMENTS: {
            target: "PostComments",
            actions: [
              assign({
                PostId: (_context, event) => event.value.PostId,
                
                username: (_context, event) => event.value.username,

                description: (_context, event) => event.value.description,

              }),
            ],
          },
          
          DELETECOMMENT: {
            target: "DeleteComment",
            actions: [
              assign({
                PostId: (_context, event) => event.value.PostId,
                
                CommentId: (_context, event) => event.value.CommentId,
                
              }),
            ],
          },

          LIKECOMMENT: {
            target: "LikeComment",
            actions: [
              assign({
                PostId: (_context, event) => event.value.PostId,
                
                CommentId: (_context, event) => event.value.CommentId,

                UserId: (_context, event) => event.value.UserId,
                
              }),
            ],
          },
          
          PROFILEPOSTS: {
            target: "GetProfilePosts",
            actions: [
              assign({
                username: (_context, event) => event.value.username,
              }),
            ],
          },

          LOGOUT: {
            target: "loggedOut",
            actions: ["sendCtx"],
          },
        },
      },

      GetSpecificUser: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/users/${context.userId}`,
              "GET",
              {},
              "FETCH_SUCCESS",
              "Error"
            );
          },
        ],
        on: {
          FETCH_SUCCESS: {
            actions: [
              assign({
                user: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      UpdateUser: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/users/${context.userId}`,
              "PUT",
              {
                user: context.user
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
                user: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      GetHomePosts: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              "http://localhost:3550/api/posts/",
              "GET",
              {},
              "FETCH_SUCCESS",
              "Error"
            );
          },
        ],
        on: {
          FETCH_SUCCESS: {
            actions: [
              assign({
                posts: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            // target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      AddPost: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              "http://localhost:3550/api/posts/",
              "POST",
              {
                username: context.username,
                description: context.description,
                myFile: context.myFile,
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
                posts: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      DeletePost: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.id}`,
              "DELETE",
              {
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
                post: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      UpdatePost: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.post._id}`,
              "PUT",
              {
                post: context.post
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
                post: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      LikePost: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.PostId}/like`,
              "POST",
              {
                UserId: context.UserId,
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
                comments: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      GetComments: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.PostId}/comments`,
              "GET",
              {
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
                comments: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      PostComments: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.PostId}/comments`,
              "POST",
              {
                username: context.username,
                description: context.description
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
                comments: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      DeleteComment: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.PostId}/comment/${context.CommentId}`,
              "DELETE",
              {
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
                comments: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      LikeComment: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.PostId}/comment/like`,
              "POST",
              {
                UserId: context.UserId,
                CommentId: context.CommentId
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
                comments: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      GetProfilePosts: {
        entry: [
          "spawnFetch",
          async (context) => {
            trigger(
              context,
              `http://localhost:3550/api/posts/${context.username}`,
              "GET",
              {},
              "FETCH_SUCCESS",
              "Error"
            );
          },
        ],
        on: {
          FETCH_SUCCESS: {
            actions: [
              assign({
                posts: (_Context, event) => {
                  return event.result;
                },
              }),
              "sendCtx",
            ],
            target: "LoggedIn",
          },
          Error: {
            actions: ["receiveMessage", "sendCtx"],
            target: "LoggedIn",
          },
        },
      },

      loggedOut: {
        type: "final",
      },

      Final: {
        type: "final",
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

module.exports = dashboardMachine;