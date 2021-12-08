import countObjectProperties from "@/utils";

export default {
  authUser(state) {
    return state.users[state.authId];
    // return {};
  },
  userPostCount: (state) => (id) =>
    countObjectProperties(state.users[id].posts),

  userThreadCount: (state) => (id) =>
    countObjectProperties(state.users[id].threads),
};
