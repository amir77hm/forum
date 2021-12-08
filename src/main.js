import Vue from "vue";
import { initializeApp, getDatabase } from "firebase/app";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import AppDate from "@/components/AppDate";
import "./assets/css/style.css";

Vue.component("AppDate", AppDate);

Vue.config.productionTip = false;

// const firebaseConfig = {
//   apiKey: "AIzaSyAm9g7-4wIg0nTBU_8t45b7XbJPVo-1rak",
//   authDomain: "forum-c8443.firebaseapp.com",
//   projectId: "forum-c8443",
//   storageBucket: "forum-c8443.appspot.com",
//   messagingSenderId: "684777384138",
//   appId: "1:684777384138:web:5c4b1e044910d7ae7bec33",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAm9g7-4wIg0nTBU_8t45b7XbJPVo-1rak",
  authDomain: "forum-c8443.firebaseapp.com",
  // For databases not in the us-central1 location, databaseURL will be of the
  // form https://[databaseName].[region].firebasedatabase.app.
  // For example, https://your-database-123.europe-west1.firebasedatabase.app
  databaseURL: "https://forum-c8443-default-rtdb.firebaseio.com",
  storageBucket: "forum-c8443.appspot.com",
};

initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    store.dispatch("fetchUser", { id: store.state.authId });
  },
}).$mount("#app");
